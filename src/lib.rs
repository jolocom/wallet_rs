#![deny(clippy::all)]
#[macro_use]
extern crate napi_derive;

use napi::{CallContext, JsObject, JsString, JsUndefined, Result};
use universal_wallet::{locked::LockedWallet, prelude::KeyType, unlocked::UnlockedWallet};

#[cfg(all(
  any(windows, unix),
  target_arch = "x86_64",
  not(target_env = "musl"),
  not(debug_assertions)
))]
#[global_allocator]
static ALLOC: mimalloc::MiMalloc = mimalloc::MiMalloc;

struct Wallet{
  unlocked: UnlockedWallet
}

/// Unlocks locked and encoded wallet into UnlockedWallet instance
/// # Parameters
/// * `locked_wallet` - Base64URL encoded encrypted wallet
/// * `login` - [String] id under which wallet was encrypted 
/// * `pass` - [Base64 encoded String] password to unlock wallet
///
/// Wallet will be instantiated into JsObject, which then can be used
///   for further calls. Details: https://napi.rs/concepts/wrap
///
#[js_function(3)]
fn attach_wallet(ctx: CallContext) -> Result<JsUndefined> {
    // can be optimized using buffers instead Strings
    let locked_wallet = ctx.get::<JsString>(0)?.into_utf8()?;
    let login = ctx.get::<JsString>(1)?.into_utf8()?;
    let pass = ctx.get::<JsString>(2)?.into_utf8()?;

    let mut this: JsObject = ctx.this_unchecked();

    let wallet =  LockedWallet::new(
      &login.as_str()?,
      decode_b64(locked_wallet.as_str()?)?
    );
    ctx
      .env
      .wrap(
        &mut this,
        Wallet{ 
          unlocked: 
            wallet.unlock(&decode_b64(pass.as_str()?)?)
              .map_err(|e| napi::Error::from_reason(e.to_string()))?
        })?;
    ctx.env.get_undefined()
}

/// Locks wallet and returns locked wallet as B64URL string
/// # Parameters
/// * `pass` - password for locking. must be B64URL encoded
///
#[js_function(1)]
fn detach_wallet(ctx: CallContext) -> Result<JsString> {
    // can be optimized using buffer instead String
    let pass = ctx.get::<JsString>(0)?.into_utf8()?;

    let wallet = get_wallet_from_context(&ctx)?;
    let locked = wallet.unlocked.lock(&decode_b64(pass.as_str()?)?)
        .map_err(|e| napi::Error::from_reason(e.to_string()))?;
    ctx.env.create_string(
      &base64::encode_config(locked.ciphertext,
        base64::URL_SAFE)
    )
}

/// Next set of functions adds key pair of selected type
/// to unlocked wallet.
/// # Parameters
/// * `controller` - [String] name of the key controller
/// * `this` - should be called on `JsObject` of instantiated
///   wallet (done with `new()' or `attach()` methods)
///
#[js_function(1)]
fn new_ecdsa_secp1_key(ctx: CallContext) -> Result<JsUndefined> {
    add_key_by_ctx(ctx, KeyType::EcdsaSecp256k1VerificationKey2019)
}
#[js_function(1)]
fn new_ecdsa_recovery_key(ctx: CallContext) -> Result<JsUndefined> {
  add_key_by_ctx(ctx, KeyType::EcdsaSecp256k1RecoveryMethod2020)
}
#[js_function(1)]
fn new_ed256_verification_key(ctx: CallContext) -> Result<JsUndefined> {
  add_key_by_ctx(ctx, KeyType::Ed25519VerificationKey2018)
}
#[js_function(1)]
fn new_gpg_verification_key(ctx: CallContext) -> Result<JsUndefined> {
  add_key_by_ctx(ctx, KeyType::GpgVerificationKey2020)
}
#[js_function(1)]
fn new_jws_verification_key(ctx: CallContext) -> Result<JsUndefined> {
  add_key_by_ctx(ctx, KeyType::JwsVerificationKey2020)
}
#[js_function(1)]
fn new_rsa_verification_key(ctx: CallContext) -> Result<JsUndefined> {
  add_key_by_ctx(ctx, KeyType::RsaVerificationKey2018)
}
#[js_function(1)]
fn new_schnorr_secp256k1_verification_key(ctx: CallContext) -> Result<JsUndefined> {
  add_key_by_ctx(ctx, KeyType::SchnorrSecp256k1VerificationKey2019)
}
#[js_function(1)]
fn new_x25519_key(ctx: CallContext) -> Result<JsUndefined> {
  add_key_by_ctx(ctx, KeyType::X25519KeyAgreementKey2019)
}

fn add_key_by_ctx(ctx: CallContext, key_type: KeyType)
  -> Result<JsUndefined> {
    let controller = ctx.get::<JsString>(0)?.into_utf8()?;
    let wallet = get_wallet_from_context(&ctx)?;
    match wallet.unlocked.new_key(key_type, Some(vec!(controller.as_str()?.into()))) {
      Err(e) => Err(napi::Error::from_reason(e.to_string())),
      _ => ctx.env.get_undefined()
    }
}
// End of key addition section

/// Instantiates new and empty wallet into JS context
/// Exact as `universal_wallet::unlocked::new(id: &str)'
/// # Parameters
/// * `login` - [String] id of newly created wallet.
///   used later to lock/unlock wallet.
///
#[js_function(1)]
fn new_wallet(ctx: CallContext) -> Result<JsUndefined> {
  let mut this: JsObject = ctx.this_unchecked();

  // can be optimized using buffers instead String
  let login = ctx.get::<JsString>(0)?.into_utf8()?;
   ctx
    .env
    .wrap(
      &mut this,
      Wallet { unlocked: UnlockedWallet::new(login.as_str()?) }
    )?;
  ctx.env.get_undefined()
}

/// Fetch key as `ContentEntry` from the wallet into JS
/// # Parameters
/// * `key_ref` - [String] search string to the key to fetch
/// * `mut output` - [JsObject] where search result will be stored to
///
#[js_function(2)]
fn get_key(ctx: CallContext) -> Result<JsUndefined> {
    let wallet = get_wallet_from_context(&ctx)?;
    let key_ref = ctx.get::<JsString>(0)?.into_utf8()?;
    let mut output = ctx.get::<JsObject>(1)?;
    ctx
      .env
      .wrap(
        &mut output,
        wallet.unlocked.get_key(key_ref.as_str()?)
      )?;
    ctx.env.get_undefined()
}

/// Fetch key as `ContentEntry` from the wallet into JS by controller
/// # Parameters
/// * `controller` - [String] of the controller we want to get content for
/// * `&mut output` - [JsObject] where search result will be stored to
///
#[js_function(2)]
fn get_key_by_controller(ctx: CallContext) -> Result<JsUndefined> {
    let wallet = get_wallet_from_context(&ctx)?;
    let controller = ctx.get::<JsString>(0)?.into_utf8()?;
    let mut output = ctx.get::<JsObject>(1)?;
    ctx
      .env
      .wrap(
        &mut output,
        wallet.unlocked.get_key_by_controller(controller.as_str()?)
      )?;
    ctx.env.get_undefined()
}

/// Sets controller of `key_ref` to `controller` value
/// # Parameters
/// * `key_ref` - [String] search string for key to update
/// * `controller` - [String] new value for the controller of the key
///
/// Will return error if any of the parameters is an empty string
///
#[js_function(2)]
fn set_key_controller(ctx: CallContext) -> Result<JsUndefined> {
    let wallet = get_wallet_from_context(&ctx)?;
    let key_ref = ctx.get::<JsString>(0)?.into_utf8()?;
    let controller = ctx.get::<JsString>(1)?.into_utf8()?;
    if key_ref.as_str()?.is_empty() || controller.as_str()?.is_empty() {
        return Err(napi::Error::from_reason("parameters cannot be empty strings".into()))
    }
    match wallet.unlocked.set_key_controller(key_ref.as_str()?, controller.as_str()?) {
        Some(()) => ctx.env.get_undefined(),
        None => Err(napi::Error::from_reason(format!("no key found for {}", key_ref.as_str()?)))
    }
}

#[module_exports]
fn init(mut exports: JsObject) -> Result<()> {
  exports.create_named_method("attach", attach_wallet)?;
  exports.create_named_method("detach", detach_wallet)?;
  exports.create_named_method("create", new_wallet)?;
  exports.create_named_method("newEcdsaSecp1Key", new_ecdsa_secp1_key)?;
  exports.create_named_method("newEcdsaRecoveryKey", new_ecdsa_recovery_key)?;
  exports.create_named_method("newEd256VerificationKey", new_ed256_verification_key)?;
  exports.create_named_method("newGpgVerificationKey", new_gpg_verification_key)?;
  exports.create_named_method("newJwsVerificationKey", new_jws_verification_key)?;
  exports.create_named_method("newRsaVerificationKey", new_rsa_verification_key)?;
  exports.create_named_method("newSchnorrSecp256k1Key", new_schnorr_secp256k1_verification_key)?;
  exports.create_named_method("newX25519Key", new_x25519_key)?;
  exports.create_named_method("getKey", get_key)?;
  exports.create_named_method("getKeyByController", get_key_by_controller)?;
  exports.create_named_method("setKeyController", set_key_controller)?;
  Ok(())
}

fn get_wallet_from_context<'ctx>(ctx: &'ctx CallContext) -> Result<&'ctx mut Wallet> {
    let mut this: JsObject = ctx.this_unchecked();
    ctx.env.unwrap::<Wallet>(&mut this)
}

fn decode_b64(data: &str) -> Result<Vec<u8>> {
      base64::decode_config(data, base64::URL_SAFE)
          .map_err(|e| napi::Error::from_reason(e.to_string()))
}


#[test]
fn b64_test() {
  let conv = base64::encode_config("alice", base64::URL_SAFE);
  assert_eq!("YWxpY2U=", &conv);
  let dec = base64::decode_config("YWxpY2U=", base64::URL_SAFE).unwrap();
  assert_eq!("alice", &String::from_utf8(dec).unwrap());
}

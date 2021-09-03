#![deny(clippy::all)]
#[macro_use]
extern crate napi_derive;
use std::{cell::RefCell, convert::TryInto, sync::Arc};
use napi::{CallContext, Env, JsNumber, JsObject, JsString, JsUndefined, Result, Task};
use universal_wallet::{locked::LockedWallet, unlocked::UnlockedWallet};

#[cfg(all(
  any(windows, unix),
  target_arch = "x86_64",
  not(target_env = "musl"),
  not(debug_assertions)
))]
#[global_allocator]
static ALLOC: mimalloc::MiMalloc = mimalloc::MiMalloc;

struct Wallet{
  unlocked: Arc<RefCell<UnlockedWallet>>
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
#[js_function(1)]
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
          unlocked: Arc::new(RefCell::new(
            wallet.unlock(&decode_b64(pass.as_str()?)?)
              .map_err(|e| napi::Error::from_reason(e.to_string()))?
          )
        )
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

    let mut this: JsObject = ctx.this_unchecked();

    let unlocked = ctx.env.unwrap::<UnlockedWallet>(&mut this)?;
    let locked = unlocked.lock(&decode_b64(pass.as_str()?)?)
        .map_err(|e| napi::Error::from_reason(e.to_string()))?;
    ctx.env.create_string(
      &base64::encode_config(locked.ciphertext,
        base64::URL_SAFE)
    )
}

fn decode_b64(data: &str) -> Result<Vec<u8>> {
      base64::decode_config(data, base64::URL_SAFE)
          .map_err(|e| napi::Error::from_reason(e.to_string()))
}

#[module_exports]
fn init(mut exports: JsObject) -> Result<()> {
  exports.create_named_method("attach", attach_wallet)?;

  exports.create_named_method("detach", detach_wallet)?;
  Ok(())
}

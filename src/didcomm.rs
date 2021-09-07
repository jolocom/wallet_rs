use napi::{CallContext, ContextlessResult, Env, JsBuffer, JsObject, JsString, JsUndefined, Result};
use universal_wallet::{didcomm_rs::{Message, crypto::CryptoAlgorithm}, unlocked::*};

/// Create empty, unpopulated DIDComm v2 message
///
#[contextless_function]
pub(crate) fn create_message(env: Env) -> ContextlessResult<JsString> {
    env.create_string(&UnlockedWallet::create_message()).map(Some)
}

/// Create DIDComm v2 `Message` as XC20P JWE
/// Sets `from` and `to` as well.
/// # Parameters
/// * `from` - [String] sender identifier
/// * `to` - [[String]] array of recipients identifiers
///
/// Return `JsString` of JSON `Message` with proper headers set
///
#[js_function(2)]
pub(crate) fn create_xc20p_jwe(ctx: CallContext) -> Result<JsString> {
    create_jwe(ctx, CryptoAlgorithm::XC20P)
}

/// Create DIDComm v2 `Message` as AES256GCM JWE
/// Sets `from` and `to` as well.
/// # Parameters
/// * `from` - [String] sender identifier
/// * `to` - [[String]] array of recipients identifiers
///
/// Return `JsString` of JSON `Message` with proper headers set
///
#[js_function(2)]
pub(crate) fn create_aes256gcm_jwe(ctx: CallContext) -> Result<JsString> {
    create_jwe(ctx, CryptoAlgorithm::A256GCM)
}

fn create_jwe(ctx: CallContext, alg: CryptoAlgorithm) -> Result<JsString> {
    let from = ctx.get::<JsString>(0)?.into_utf8()?;
    let js_to = &ctx.get::<JsObject>(1)?;
    let len = js_to.get_array_length()?;
    if len == 0 {
        return Err(napi::Error::from_reason("'to' array must have at least one recipient".into()))?;
    }
    let mut to: Vec<String> = Vec::with_capacity(len as usize);
    for index in 0..len {
        let js_s = js_to.get_element::<JsString>(index)?.into_utf8()?;
        to.push(js_s.as_str()?.into());
    }
    let to: Vec<&str> = to.iter().map(std::ops::Deref::deref).collect();
    ctx.env.create_string(&UnlockedWallet::create_jwe_message(from.as_str()?, &to, alg))
}

/// Seal encrypted DIDComm v2 message
/// # Parameters
/// * `js_message` - [JsObject] of `Message` of type created with:
///     `create_message()`
/// 
/// Return `JsString` of encrypted JWE.
///
/// Keys should be present in wallet for controller `from` property
///     and `from` and `to` properties must be set correctly;
/// 
#[js_function(1)]
pub(crate) fn seal_encrypted(ctx: CallContext) -> Result<JsString> {
    let wallet = super::get_wallet_from_context(&ctx)?;
    let mut js_message = ctx.get::<JsObject>(0)?;
    let message: &mut Message = ctx.env.unwrap(&mut js_message)?;
    ctx.env.create_string(
        &wallet.unlocked.seal_encrypted(message.to_owned())
            .map_err(|e| napi::Error::from_reason(e.to_string()))?
    )
}

/// Seal encrypted DIDComm v2 message as JWE
/// # Parameters
/// * `message` - [String] JSON string of `Message` to encrypt
/// 
/// Return `JsString` of encrypted JWE.
///
/// Keys should be present in wallet for controller `from` property
///     and `from` and `to` properties must be set correctly;
/// 
#[js_function(1)]
pub(crate) fn seal_encrypted_str(ctx: CallContext) -> Result<JsString> {
    let wallet = super::get_wallet_from_context(&ctx)?;
    let message = ctx.get::<JsString>(0)?.into_utf8()?;
    ctx.env.create_string(
        &wallet.unlocked.seal_encrypted_str(message.as_str()?)
            .map_err(|e| napi::Error::from_reason(e.to_string()))?
    )
}

/// Seal DIDComm v2 message as JWS
/// # Parameters
/// * `message` - [String] JSON string of `Message` to sign
///
/// Return `JsString` of signed JWS
///
/// Key for signing should be present in wallet for controller `from` property
///     and `from` should be correctly set in the message prior to signing.
///
#[js_function(1)]
pub(crate) fn seal_signed_str(ctx: CallContext) -> Result<JsString> {
    let wallet = super::get_wallet_from_context(&ctx)?;
    let message = ctx.get::<JsString>(0)?.into_utf8()?;
    ctx.env.create_string(
        &wallet.unlocked.seal_signed(message.as_str()?)
            .map_err(|e| napi::Error::from_reason(e.to_string()))?
    )
}

/// Receive DIDComm v2 message
/// # Parameters
/// * `msg_bytes` - [Buffer of bytes \ &[u8]] - raw received message bytes
/// * `&mut output` - [JsObject \ Message] result will be put into this object
///
#[js_function(2)]
pub(crate) fn receive_message(ctx: CallContext) -> Result<JsUndefined> {
    let wallet = super::get_wallet_from_context(&ctx)?;
    let msg_bytes = ctx.get::<JsBuffer>(0)?.into_value()?;
    let mut output = ctx.get::<JsObject>(1)?;
    ctx.env.wrap(&mut &mut output,
        wallet.unlocked.receive_message(&msg_bytes)
            .map_err(|e| napi::Error::from_reason(e.to_string()))?
    )?;
    ctx.env.get_undefined()
}

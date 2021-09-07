use napi::{CallContext, ContextlessResult, Env, JsBuffer, JsObject, JsString, JsUndefined, Result};
use universal_wallet::{didcomm_rs::Message, unlocked::*};

/// Create empty, unpopulated DIDComm v2 message
///
#[contextless_function]
pub(crate) fn create_message(env: Env) -> ContextlessResult<JsString> {
    env.create_string(&UnlockedWallet::create_message()).map(Some)
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

const { loadBinding } = require('@node-rs/helper')

/**
 * __dirname means load native addon from current dir
 * 'wallet-rs' means native addon name is `wallet-rs`
 * the first arguments was decided by `napi.name` field in `package.json`
 * the second arguments was decided by `name` field in `package.json`
 * loadBinding helper will load `wallet-rs.[PLATFORM].node` from `__dirname` first
 * If failed to load addon, it will fallback to load from `@jolocom/wallet-rs-[PLATFORM]`
 */
module.exports = loadBinding(__dirname, 'wallet-rs', '@jolocom/wallet-rs')

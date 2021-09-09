import { loadBinding } from '@node-rs/helper'
import { NativeBindings } from './types'

/**
 * The first argument means load native addon from the specified dir
 * The second argument means native addon name is `wallet-rs`
 * the first arguments was decided by `napi.name` field in `package.json`
 * the second arguments was decided by `name` field in `package.json`
 * loadBinding helper will load first `wallet-rs.[PLATFORM].node` from the path defined as a first argument
 * If failed to load addon, it will fallback to load from `@jolocom/wallet-rs-[PLATFORM]`
 */
export default loadBinding(__dirname + '/../', 'wallet-rs', '@jolocom/wallet-rs') as NativeBindings

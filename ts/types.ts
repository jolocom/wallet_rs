export interface NativeBindings {
  /**
   * Unlocks locked and encoded wallet into UnlockedWallet instance.
   *
   * @param {string} lockedWallet Base64URL encoded encrypted wallet.
   * @param {string} login The id under which wallet was encrypted.
   * @param {string} password Base64 encoded password to unlock wallet.
   * @return {void}
   */
  attach: (lockedWallet: string, login: string, password: string) => void

  /**
   * Locks wallet and returns locked wallet as B64URL string.
   *
   * @param {string} password The password for locking. Must be B64URL encoded.
   * @return {string} Locked wallet as B64URL string.
   */
  detach: (password: string) => string

  /**
   * Instantiates new and empty wallet into JS context.
   *
   * @param {string} id The id of newly created wallet. Used later to lock/unlock the wallet.
   * @return {void}
   */
  create: (id: string) => void

  /**
   * Adds key pair of selected type to unlocked wallet.
   *
   * @param {string} controller The name of the key controller.
   * @return {void}
   */
  newEcdsaSecp1Key: (controller: string) => void

  /**
   * Adds key pair of selected type to unlocked wallet.
   *
   * @param {string} controller The name of the key controller.
   * @return {void}
   */
  newEcdsaRecoveryKey: (controller: string) => void

  /**
   * Adds key pair of selected type to unlocked wallet.
   *
   * @param {string} controller The name of the key controller.
   * @return {void}
   */
  newEd256VerificationKey: (controller: string) => void

  /**
   * Adds key pair of selected type to unlocked wallet.
   *
   * @param {string} controller The name of the key controller.
   * @return {void}
   */
  newGpgVerificationKey: (controller: string) => void

  /**
   * Adds key pair of selected type to unlocked wallet.
   *
   * @param {string} controller The name of the key controller.
   * @return {void}
   */
  newJwsVerificationKey: (controller: string) => void

  /**
   * Adds key pair of selected type to unlocked wallet.
   *
   * @param {string} controller The name of the key controller.
   * @return {void}
   */
  newRsaVerificationKey: (controller: string) => void

  /**
   * Adds key pair of selected type to unlocked wallet.
   *
   * @param {string} controller The name of the key controller.
   * @return {void}
   */
  newSchnorrSecp256k1Key: (controller: string) => void

  /**
   * Adds key pair of selected type to unlocked wallet.
   *
   * @param {string} controller The name of the key controller.
   * @return {void}
   */
  newX25519Key: (controller: string) => void

  /**
   * Fetch key as `ContentEntry` from the wallet into JS.
   *
   * @param {string} keyReference Search string to the key to fetch.
   * @return {void}
   */
  getKey: (keyReference: string) => string

  /**
   * Fetch key as `ContentEntry` from the wallet into JS by controller.
   *
   * @param {string} controller The controller we want to get content for.
   * @return {void}
   */
  getKeyByController: (controller: string) => string

  /**
   * Sets controller of `keyReference` to `controller` value.
   *
   * @param {string} keyReference Search string for key to update.
   * @param {string} controller The new value for the controller of the key.
   * @throws {Error} If any of the parameters is an empty string.
   * @return {void}
   */
  setKeyController: (keyReference: string, controller: string) => void

  /**
   * Sign arbitrary data with referred key and return signature.
   *
   * @param {string} keyReference Key identifier for which key to use for signing.
   * @param {Buffer} subject Data to be signed.
   * @throws {Error} If signing process unsuccessful (Provided reference is empty string or data to sign is empty).
   * @returns {ArrayBuffer} {@link ArrayBuffer} with signature.
   */
  signRaw: (keyReference: string, subject: Buffer) => ArrayBuffer

  /**
   * Decrypts provided cypher text using desired key by reference.
   *
   * @param {string} keyReference The key to be fetched to use for decryption.
   * @param {Buffer} subject The cipher to be decrypted.
   * @param {Buffer} aad An `Option` to be used for AAD algorithm.
   * @throws {Error} If subject decryption failed.
   * @returns {ArrayBuffer} {@link ArrayBuffer} with decrypted data.
   */
  decrypt: (keyReference: string, subject: Buffer, aad: Buffer) => ArrayBuffer

  /**
   * Performs ECDH Key Agreement.
   *
   * @param {string} keyReference Private key ref for ECDH.
   * @param {Buffer} otherKey Other public key for ECDH.
   * @throws {Error} If ECDH Key Agreement processing failed.
   * @returns {ArrayBuffer} {@link ArrayBuffer} with key agreement resulting key.
   */
  ecdhKeyAgreement: (keyReference: string, otherKey: Buffer) => ArrayBuffer

  /**
   * Create empty, unpopulated DIDComm v2 message.
   *
   * @returns {string} DIDComm v2 message as JSON encoded string.
   */
  createMessage: () => string

  /**
   * Seal encrypted DIDComm v2 message.
   *
   * Keys should be present in wallet for controller `from` property
   * and `from` and `to` properties must be set correctly.
   *
   * @param {Record<string, unknown>} message of type created with 'NativeBindings::createMessage()'.
   * @returns {string} Encrypted JWE as a {@link string}.
   */
  sealEncrypted: (message: Record<string, unknown>) => string

  /**
   * Receive DIDComm v2 message.
   *
   * @param {Buffer} message Raw received message bytes.
   * @return {string} JSON serialized dicomm V2 Message.
   */
  receiveMessage: (message: Buffer) => string

  /**
   * Seal encrypted DIDComm v2 message as JWE.
   *
   * Keys should be present in wallet for controller `from` property
   * and `from` and `to` properties must be set correctly.
   *
   * @param {string} message The message to encrypt.
   * @returns {string} Encrypted JWE as a {@link string}.
   */
  sealJsonMessageJwe: (message: string) => string

  /**
   * Seal DIDComm v2 message as JWS.
   *
   * Key for signing should be present in wallet for controller `from` property
   * and `from` should be correctly set in the message prior to signing.
   *
   * @param {string} message The message to sign.
   * @returns {string} Signed JWS as a {@link string}.
   */
  sealJsonMessageJws: (message: string) => string

  /**
   * Create DIDComm v2 `Message` as XC20P JWE.
   *
   * Sets `from` and `to` as well.
   *
   * @param {string} from The sender identifier.
   * @param {string[]} to An array of recipients identifiers.
   * @returns {string} JSON encoded {@link string} as a `Message` with proper headers set.
   */
  createXc20pJwe: (from: string, to: string[]) => string

  /**
   * Create DIDComm v2 `Message` as AES256GCM JWE.
   *
   * Sets `from` and `to` as well.
   *
   * @param {string} from The sender identifier.
   * @param {string[]} to An array of recipients identifiers.
   * @returns {string} JSON encoded {@link string} as a `Message` with proper headers set.
   */
  createAes256GcmJwe: (from: string, to: string[]) => string
}

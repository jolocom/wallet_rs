import bindings from './bindings'

export class Wallet {
  /**
   * Unlocks locked and encoded wallet into UnlockedWallet instance.
   *
   * @param {string} lockedWallet Base64URL encoded encrypted wallet.
   * @param {string} login The id under which wallet was encrypted.
   * @param {string} password Base64 encoded password to unlock wallet.
   * @return {void}
   */
  attach(lockedWallet: string, login: string, password: string): void {
     bindings.attach.call(this, lockedWallet, login, password)
  }

  /**
   * Locks wallet and returns locked wallet as B64URL string.
   *
   * @param {string} password The password for locking. Must be B64URL encoded.
   * @return {string} Locked wallet as B64URL string.
   */
  detach(password: string): string {
    return bindings.detach.call(this, password)
  }

  /**
   * Instantiates new and empty wallet into JS context.
   *
   * @param {string} id The id of newly created wallet. Used later to lock/unlock the wallet.
   * @return {void}
   */
  create(id: string): void {
    bindings.create.call(this, id)
  }

  /**
   * Adds key pair of selected type to unlocked wallet.
   *
   * @param {string} controller The name of the key controller.
   * @return {void}
   */
  newEcdsaSecp1Key(controller: string): void {
    bindings.newEcdsaSecp1Key.call(this, controller)
  }

  /**
   * Adds key pair of selected type to unlocked wallet.
   *
   * @param {string} controller The name of the key controller.
   * @return {void}
   */
  newEcdsaRecoveryKey(controller: string): void {
    bindings.newEcdsaRecoveryKey.call(this, controller)
  }

  /**
   * Adds key pair of selected type to unlocked wallet.
   *
   * @param {string} controller The name of the key controller.
   * @return {void}
   */
  newEd256VerificationKey(controller: string): void {
    bindings.newEd256VerificationKey.call(this, controller)
  }

  /**
   * Adds key pair of selected type to unlocked wallet.
   *
   * @param {string} controller The name of the key controller.
   * @return {void}
   */
  newGpgVerificationKey(controller: string): void {
    bindings.newGpgVerificationKey.call(this, controller)
  }

  /**
   * Adds key pair of selected type to unlocked wallet.
   *
   * @param {string} controller The name of the key controller.
   * @return {void}
   */
  newJwsVerificationKey(controller: string): void {
    bindings.newJwsVerificationKey.call(this, controller)
  }

  /**
   * Adds key pair of selected type to unlocked wallet.
   *
   * @param {string} controller The name of the key controller.
   * @return {void}
   */
  newRsaVerificationKey(controller: string): void {
    bindings.newRsaVerificationKey.call(this, controller)
  }

  /**
   * Adds key pair of selected type to unlocked wallet.
   *
   * @param {string} controller The name of the key controller.
   * @return {void}
   */
  newSchnorrSecp256k1Key(controller: string): void {
    bindings.newSchnorrSecp256k1Key.call(this, controller)
  }

  /**
   * Adds key pair of selected type to unlocked wallet.
   *
   * @param {string} controller The name of the key controller.
   * @return {void}
   */
  newX25519Key(controller: string): void {
    bindings.newX25519Key.call(this, controller)
  }

  /**
   * Fetch key as `ContentEntry` from the wallet into JS.
   *
   * @param {string} keyReference Search string to the key to fetch.
   * @param {object} output Where search result will be stored to.
   * @return {void}
   */
  getKey(keyReference: string, output: object): void {
    bindings.getKey.call(this, keyReference, output)
  }

  /**
   * Fetch key as `ContentEntry` from the wallet into JS by controller.
   *
   * @param {string} controller The controller we want to get content for.
   * @param {object} output Where search result will be stored to.
   * @return {void}
   */
  getKeyByController(controller: string, output: object): void {
    bindings.getKeyByController.call(this, controller, output)
  }

  /**
   * Sets controller of `keyReference` to `controller` value.
   *
   * @param {string} keyReference Search string for key to update.
   * @param {string} controller The new value for the controller of the key.
   * @throws Error If any of the parameters is an empty string.
   * @return {void}
   */
  setKeyController(keyReference: string, controller: string): void {
    bindings.setKeyController.call(this, keyReference, controller)
  }

  /**
   * Sign arbitrary data with referred key and return signature.
   *
   * @param {string} keyReference Key identifier for which key to use for signing.
   * @param {Buffer} subject Data to be signed.
   * @throws {Error} If signing process unsuccessful (Provided reference is empty string or data to sign is empty).
   * @returns {ArrayBuffer} {@link ArrayBuffer} with signature.
   */
  signRaw(keyReference: string, subject: Buffer): ArrayBuffer {
    return bindings.signRaw.call(this, keyReference, subject)
  }

  /**
   * Decrypts provided cypher text using desired key by reference.
   *
   * @param {string} keyReference The key to be fetched to use for decryption.
   * @param {Buffer} subject The cipher to be decrypted.
   * @param {Buffer} aad An `Option` to be used for AAD algorithm.
   * @throws {Error} If subject decryption failed.
   * @returns {ArrayBuffer} {@link ArrayBuffer} with decrypted data.
   */
  decrypt(keyReference: string, subject: Buffer, aad: Buffer): ArrayBuffer {
    return bindings.decrypt.call(this, keyReference, subject, aad)
  }

  /**
   * Performs ECDH Key Agreement.
   *
   * @param {string} keyReference Private key ref for ECDH.
   * @param {Buffer} otherKey Other public key for ECDH.
   * @throws {Error} If ECDH Key Agreement processing failed.
   * @returns {ArrayBuffer} {@link ArrayBuffer} with key agreement resulting key.
   */
  ecdhKeyAgreement(keyReference: string, otherKey: Buffer): ArrayBuffer {
    return bindings.ecdhKeyAgreement.call(this, keyReference, otherKey)
  }

  /**
   * Create empty, unpopulated DIDComm v2 message.
   *
   * @returns {string} DIDComm v2 message as JSON encoded string.
   */
  createMessage(): string {
    return bindings.createMessage.call(this)
  }

  /**
   * Seal encrypted DIDComm v2 message.
   *
   * Keys should be present in wallet for controller `from` property
   * and `from` and `to` properties must be set correctly.
   *
   * @param {object} message {@link object} (message) of type created with 'NativeBindings::createMessage()'.
   * @returns {string} Encrypted JWE as a {@link string}.
   */
  sealEncrypted(message: object): string {
    return bindings.sealEncrypted.call(this, message)
  }

  /**
   * Receive DIDComm v2 message.
   *
   * @param {Buffer} message Raw received message bytes.
   * @param {object} output Execution resulting output.
   * @return {void}
   */
  receiveMessage(message: Buffer, output: object): void {
    bindings.receiveMessage.call(this, message, output)
  }

  /**
   * Seal encrypted DIDComm v2 message as JWE.
   *
   * Keys should be present in wallet for controller `from` property
   * and `from` and `to` properties must be set correctly.
   *
   * @param {string} message The message to encrypt.
   * @returns {string} Encrypted JWE as a {@link string}.
   */
  sealJsonMessageJwe(message: string): string {
    return bindings.sealJsonMessageJwe.call(this, message)
  }

  /**
   * Seal DIDComm v2 message as JWS.
   *
   * Key for signing should be present in wallet for controller `from` property
   * and `from` should be correctly set in the message prior to signing.
   *
   * @param {string} message The message to sign.
   * @returns {string} Signed JWS as a {@link string}.
   */
  sealJsonMessageJws(message: string): string {
    return bindings.sealJsonMessageJws.call(this, message)
  }

  /**
   * Create DIDComm v2 `Message` as XC20P JWE.
   *
   * Sets `from` and `to` as well.
   *
   * @param {string} from The sender identifier.
   * @param {string[]} to An array of recipients identifiers.
   * @returns {string} JSON encoded {@link string} as a `Message` with proper headers set.
   */
  createXc20pJwe(from: string, to: string[]): string {
    return bindings.createXc20pJwe.call(this, from, to)
  }

  /**
   * Create DIDComm v2 `Message` as AES256GCM JWE.
   *
   * Sets `from` and `to` as well.
   *
   * @param {string} from The sender identifier.
   * @param {string[]} to An array of recipients identifiers.
   * @returns {string} JSON encoded {@link string} as a `Message` with proper headers set.
   */
  createAes256GcmJwe(from: string, to: string[]): string {
    return bindings.createAes256GcmJwe.call(this, from, to)
  }
}

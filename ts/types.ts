export interface NativeBindings {
  /**
   * Unlocks locked and encoded wallet into UnlockedWallet instance.
   *
   * @param {string} lockedWallet Base64URL encoded encrypted wallet.
   * @param {string} login The id under which wallet was encrypted.
   * @param {string} password Base64 encoded password to unlock wallet.
   * @return {void}
   */
  attach(lockedWallet: string, login: string, password: string): void

  /**
   * Locks wallet and returns locked wallet as B64URL string.
   *
   * @param {string} password The password for locking. Must be B64URL encoded.
   * @return {string} Locked wallet as B64URL string.
   */
  detach(password: string): string

  /**
   * Instantiates new and empty wallet into JS context.
   *
   * @param {string} id The id of newly created wallet. Used later to lock/unlock the wallet.
   * @return {void}
   */
  create(id: string): void

  /**
   * Adds key pair of selected type to unlocked wallet.
   *
   * @param {string} controller The name of the key controller.
   * @return {void}
   */
  newEcdsaSecp1Key(controller: string): void

  /**
   * Adds key pair of selected type to unlocked wallet.
   *
   * @param {string} controller The name of the key controller.
   * @return {void}
   */
  newEcdsaRecoveryKey(controller: string): void

  /**
   * Adds key pair of selected type to unlocked wallet.
   *
   * @param {string} controller The name of the key controller.
   * @return {void}
   */
  newEd256VerificationKey(controller: string): void

  /**
   * Adds key pair of selected type to unlocked wallet.
   *
   * @param {string} controller The name of the key controller.
   * @return {void}
   */
  newGpgVerificationKey(controller: string): void

  /**
   * Adds key pair of selected type to unlocked wallet.
   *
   * @param {string} controller The name of the key controller.
   * @return {void}
   */
  newJwsVerificationKey(controller: string): void

  /**
   * Adds key pair of selected type to unlocked wallet.
   *
   * @param {string} controller The name of the key controller.
   * @return {void}
   */
  newRsaVerificationKey(controller: string): void

  /**
   * Adds key pair of selected type to unlocked wallet.
   *
   * @param {string} controller The name of the key controller.
   * @return {void}
   */
  newSchnorrSecp256k1Key(controller: string): void

  /**
   * Adds key pair of selected type to unlocked wallet.
   *
   * @param {string} controller The name of the key controller.
   * @return {void}
   */
  newX25519Key(controller: string): void

  /**
   * Fetch key as `ContentEntry` from the wallet into JS.
   *
   * @param {string} keyReference Search string to the key to fetch.
   * @param {object} output Where search result will be stored to.
   * @return {void}
   */
  getKey(keyReference: string, output: object): void

  /**
   * Fetch key as `ContentEntry` from the wallet into JS by controller.
   *
   * @param {string} controller The controller we want to get content for.
   * @param {object} output Where search result will be stored to.
   * @return {void}
   */
  getKeyByController(controller: string, output: object): void

  /**
   * Sets controller of `keyReference` to `controller` value.
   *
   * @param {string} keyReference Search string for key to update.
   * @param {string} controller The new value for the controller of the key.
   * @throws {Error} If any of the parameters is an empty string.
   * @return {void}
   */
  setKeyController(keyReference: string, controller: string): void
}

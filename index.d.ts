declare const wallet: {
  /**
   * Unlocks locked and encoded wallet into UnlockedWallet instance.
   *
   * @param {string} lockedWallet Base64URL encoded encrypted wallet.
   * @param {string} login The id under which wallet was encrypted.
   * @param {string} password Base64 encoded password to unlock wallet.
   */
  attach: (lockedWallet: string, login: string, password: string) => undefined

  /**
   * Locks wallet and returns locked wallet as B64URL string.
   *
   * @param {string} password The password for locking. Must be B64URL encoded.
   */
  detach: (password: string) => string

  /**
   * Instantiates new and empty wallet into JS context.
   *
   * @param {string} id The id of newly created wallet. Used later to lock/unlock the wallet.
   */
  create: (id: string) => string

  /**
   * Adds key pair of selected type to unlocked wallet.
   *
   * @param {string} controller The name of the key controller.
   */
  newEcdsaSecp1Key: (controller: string) => undefined

  /**
   * Adds key pair of selected type to unlocked wallet.
   *
   * @param {string} controller The name of the key controller.
   */
  newEcdsaRecoveryKey: (controller: string) => undefined

  /**
   * Adds key pair of selected type to unlocked wallet.
   *
   * @param {string} controller The name of the key controller.
   */
  newEd256VerificationKey: (controller: string) => undefined

  /**
   * Adds key pair of selected type to unlocked wallet.
   *
   * @param {string} controller The name of the key controller.
   */
  newGpgVerificationKey: (controller: string) => undefined

  /**
   * Adds key pair of selected type to unlocked wallet.
   *
   * @param {string} controller The name of the key controller.
   */
  newJwsVerificationKey: (controller: string) => undefined

  /**
   * Adds key pair of selected type to unlocked wallet.
   *
   * @param {string} controller The name of the key controller.
   */
  newRsaVerificationKey: (controller: string) => undefined

  /**
   * Adds key pair of selected type to unlocked wallet.
   *
   * @param {string} controller The name of the key controller.
   */
  newSchnorrSecp256k1Key: (controller: string) => undefined

  /**
   * Adds key pair of selected type to unlocked wallet.
   *
   * @param {string} controller The name of the key controller.
   */
  newX25519Key: (controller: string) => undefined

  /**
   * Fetch key as `ContentEntry` from the wallet into JS.
   *
   * @param {string} keyReference Search string to the key to fetch.
   * @param {object} output Where search result will be stored to.
   */
  getKey: (keyReference: string, output: object) => undefined

  /**
   * Fetch key as `ContentEntry` from the wallet into JS by controller.
   *
   * @param {string} controller The controller we want to get content for.
   * @param {object} output Where search result will be stored to.
   */
  getKeyByController: (controller: string, output: object) => undefined

  /**
   * Sets controller of `keyReference` to `controller` value.
   *
   * @param {string} keyReference Search string for key to update.
   * @param {string} controller The new value for the controller of the key.
   *
   * @throws Error If any of the parameters is an empty string.
   */
  setKeyController: (keyReference: string, controller: string) => undefined
}

export default wallet

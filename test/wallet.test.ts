import test from 'ava'

import { Wallet } from '../ts'

import { encodedWallets } from './fixture'
import { encodePassword } from './utils'

test('attach wallet from native code', (t) => {
  t.plan(1)
  t.notThrows(() => createAndAttachWallet(encodedWallets.alice, 'alice', 'alice'))
})

test('sleep function from native code', (t) => {
  const wallet = createAndAttachWallet(encodedWallets.alice, 'alice', 'alice')

  t.plan(1)
  t.notThrows(() => wallet.detach(encodePassword('alice')))
})

test('new ecdsa sec1p key', (t) => {
  const wallet = createAndAttachWallet(encodedWallets.bob, 'bob', 'bob')

  t.plan(2)
  t.notThrows(() => {
    wallet.newEcdsaSecp1Key('did:keri:123456789')
    const key = {}
    wallet.getKeyByController('did::keri:123456789', key)
    t.assert(key)
  })
})

test('new x25519 key', (t) => {
  const wallet = createAndAttachWallet(encodedWallets.bob, 'bob', 'bob')

  t.plan(2)
  t.notThrows(() => {
    wallet.newX25519Key('did:bob:marleY')
    const key = {}
    wallet.getKeyByController('did:bob:marleY', key)
    t.assert(key)
  })
})

const createAndAttachWallet = (encodedWallet: string, login: string, password: string) => {
  const wallet = new Wallet()
  wallet.attach(encodedWallet, login, encodePassword(password))

  return wallet
}

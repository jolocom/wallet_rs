import test from 'ava'

import { Wallet } from '../ts'

import { encodedWallets } from './fixture'
import { encodePassword } from './utils'

test('create empty message', (t) => {
  const wallet = new Wallet()

  t.plan(3)
  t.notThrows(() => {
    wallet.attach(encodedWallets.alice, 'alice', encodePassword('alice'))
    const message = wallet.createMessage()
    t.truthy(message)
    t.not(message, '')
    wallet.detach(encodePassword('something'))
  })
})

test('create jwe message', (t) => {
  const wallet = new Wallet()
  wallet.attach(encodedWallets.alice, 'alice', encodePassword('alice'))

  let message

  t.notThrows(() => {
    message = wallet.createAes256GcmJwe('did:alice:1234', ['did:bob:5678'])
  })

  wallet.detach(encodePassword('something'))

  t.plan(3)
  t.truthy(message)
  t.not(message, '')
})

test('seal', (t) => {
  const wallet = new Wallet()

  t.plan(3)
  t.notThrows(() => {
    wallet.attach(encodedWallets.alice, 'alice', encodePassword('alice'))

    const message = wallet.createAes256GcmJwe('did:key:z6MkiTBz1ymuepAQ4HEHYSF1H8quG5GLVVQR3djdX3mDooWp', [
      'did:key:z6MkjchhfUsD6mmvni8mCdXHw216Xrm9bQe2mBH1P5RDjVJG',
    ])
    const sealed = wallet.sealJsonMessageJwe(message)

    wallet.detach('something')

    const jwe = JSON.parse(sealed)

    t.truthy(jwe.from)
    t.is(jwe.from, 'did:key:z6MkiTBz1ymuepAQ4HEHYSF1H8quG5GLVVQR3djdX3mDooWp')
  })
})

test('receive', (t) => {
  const alice_wallet = new Wallet()
  const bob_wallet = new Wallet()

  alice_wallet.attach(encodedWallets.alice, 'alice', encodePassword('alice'))
  bob_wallet.attach(encodedWallets.bob, 'bob', encodePassword('bob'))

  t.plan(4)
  t.notThrows(() => {
    const message = alice_wallet.createAes256GcmJwe('did:key:z6MkiTBz1ymuepAQ4HEHYSF1H8quG5GLVVQR3djdX3mDooWp', [
      'did:key:z6MkjchhfUsD6mmvni8mCdXHw216Xrm9bQe2mBH1P5RDjVJG',
    ])
    const sealed = alice_wallet.sealJsonMessageJwe(message)
    const received = {}

    bob_wallet.receiveMessage(Buffer.from(sealed), received)

    t.truthy(Object.prototype.hasOwnProperty.call(received, 'data'))
    t.is((received as { from: string }).from, 'did:key:z6MkiTBz1ymuepAQ4HEHYSF1H8quG5GLVVQR3djdX3mDooWp')
    t.truthy(Object.prototype.hasOwnProperty.call(received, 'from'))
  })
})

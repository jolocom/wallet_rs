import test from 'ava'

import { Wallet } from '../ts'

import { encodedWallets } from './fixture'
import { encodePassword } from './utils'

let walletsToDetach: Wallet[] = []

test.afterEach(() => {
  do {
    let wallet = walletsToDetach.pop()
    if (wallet) {
      wallet.detach(encodePassword('something'))
    } else {
      break
    }
  } while (true)
})

test('create empty message', (t) => {
  const wallet = createAndAttachWallet(encodedWallets.alice, 'alice', 'alice')
  let message

  t.plan(3)
  t.notThrows(() => {
    message = wallet.createMessage()
  })
  t.truthy(message)
  t.not(message, '')
})

test('create jwe message', (t) => {
  const wallet = createAndAttachWallet(encodedWallets.alice, 'alice', 'alice')
  let message: any

  t.plan(3)
  t.notThrows(() => {
    message = wallet.createAes256GcmJwe('did:alice:1234', ['did:bob:5678'])
  })
  t.truthy(message)
  t.not(message, '')
})

test('seal', (t) => {
  const wallet = createAndAttachWallet(encodedWallets.alice, 'alice', 'alice')
  const message = wallet.createXc20pJwe('did:key:z6MkiTBz1ymuepAQ4HEHYSF1H8quG5GLVVQR3djdX3mDooWp', [
    'did:key:z6MkjchhfUsD6mmvni8mCdXHw216Xrm9bQe2mBH1P5RDjVJG',
  ])
  let jwe: any

  t.plan(3)
  t.notThrows(() => {
    const sealed = wallet.sealJsonMessageJwe(message)
    jwe = JSON.parse(sealed)
  })
  t.true(Object.prototype.hasOwnProperty.call(jwe, 'from'))
  t.is((jwe as { from: string }).from, 'did:key:z6MkiTBz1ymuepAQ4HEHYSF1H8quG5GLVVQR3djdX3mDooWp')
})

test('receive', (t) => {
  const aliceWallet = createAndAttachWallet(encodedWallets.alice, 'alice', 'alice')
  const bobWallet = createAndAttachWallet(encodedWallets.bob, 'bob', 'bob')
  const message = aliceWallet.createXc20pJwe('did:key:z6MkiTBz1ymuepAQ4HEHYSF1H8quG5GLVVQR3djdX3mDooWp', [
    'did:key:z6MkjchhfUsD6mmvni8mCdXHw216Xrm9bQe2mBH1P5RDjVJG',
  ])
  const sealed = aliceWallet.sealJsonMessageJwe(message)
  let received = {}

  t.plan(4)
  t.notThrows(() => {
    received = bobWallet.receiveMessage(Buffer.from(sealed))
  })
  t.truthy(Object.prototype.hasOwnProperty.call(received, 'data'))
  t.is((received as { from: string }).from, 'did:key:z6MkiTBz1ymuepAQ4HEHYSF1H8quG5GLVVQR3djdX3mDooWp')
  t.truthy(Object.prototype.hasOwnProperty.call(received, 'from'))
})

const createAndAttachWallet = (encodedWallet: string, login: string, password: string) => {
  const wallet = new Wallet()

  wallet.attach(encodedWallet, login, encodePassword(password))
  walletsToDetach.push(wallet)

  return wallet
}

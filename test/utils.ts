import { Buffer } from 'buffer'

export const encodePassword = (password: string) => {
  return Buffer.from(password, 'utf-8').toString('base64')
}

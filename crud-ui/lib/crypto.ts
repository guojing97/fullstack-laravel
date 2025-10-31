const SECRET_KEY = process.env.NEXT_PUBLIC_TOKEN_SECRET || 'default-key'
const CryptoJS = require('crypto-js')

export function encryptToken(token: string): string {
  return CryptoJS.AES.encrypt(token, SECRET_KEY).toString()
}

export function decryptToken(encryptedToken: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedToken, SECRET_KEY)
  return bytes.toString(CryptoJS.enc.Utf8)
}

export const encryptObject = (obj: any): string => {
  const json = JSON.stringify(obj)
  return encryptToken(json)
}

export const decryptObject = <T>(cipherText: string): T | null => {
  try {
    const decrypted = decryptToken(cipherText)
    return JSON.parse(decrypted) as T
  } catch {
    return null
  }
}

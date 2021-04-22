import { Encrypter } from '../../data/protocols/encrypter'
import bcrypt from 'bcrypt'
export class BcryptAdapter implements Encrypter {
  private readonly _salt: number

  constructor (salt: number) {
    this._salt = salt
  }

  async encrypt (value: string): Promise<string> {
    await bcrypt.hash(value,this._salt)
    return null
  }
}

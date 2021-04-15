
import { Encrypter } from '@/data/protocols/Encrypter'
import { AccountModel } from '@/domain/models/account'
import { AddAccount, AddAccountDto } from 'domain/usecases/add-account'

export class DbAddAccount implements AddAccount {
  private readonly _encrypter: Encrypter

  constructor (encrypter: Encrypter) {
    this._encrypter = encrypter
  }

  async add (account: AddAccountDto): Promise<AccountModel> {
    await this._encrypter.encrypt(account.password)
    return await Promise.resolve(null)
  }
}

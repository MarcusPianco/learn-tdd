import { AddAccount, AddAccountDto,AccountModel, Encrypter } from './db-add-account-protocols'

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

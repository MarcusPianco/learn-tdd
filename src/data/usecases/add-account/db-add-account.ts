import { AddAccount, AddAccountDto,AccountModel, Encrypter, AddAccountRepository } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  private readonly _encrypter: Encrypter
  private readonly _addAccountRepository: AddAccountRepository

  constructor (encrypter: Encrypter, addAccountRepository: AddAccountRepository) {
    this._encrypter = encrypter
    this._addAccountRepository = addAccountRepository
  }

  async add (accountData: AddAccountDto): Promise<AccountModel> {
    const hashedPassword = await this._encrypter.encrypt(accountData.password)
    const account = await this._addAccountRepository.add(Object.assign({},accountData,{ password: hashedPassword }))
    return account
  }
}

import { AddAccountRepository } from '@/data/protocols/add-account-repository'
import { AccountModel } from '@/domain/models/account'
import { AddAccountDto } from '@/domain/usecases/add-account'

import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository {
  public async add (accountDto: AddAccountDto): Promise<AccountModel> {
    const accountcollection = MongoHelper.getCollection('accounts')
    const resultOpInsertAccount = await accountcollection.insertOne(accountDto)
    const { _id, ...accountWithoudUnderId } = resultOpInsertAccount.ops[0]
    return Object.assign({},accountWithoudUnderId,{ id: _id })
  }
}
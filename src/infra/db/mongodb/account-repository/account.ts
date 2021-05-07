import { AddAccountRepository } from '@/data/protocols/add-account-repository'
import { AccountModel } from '@/domain/models/account'
import { AddAccountDto } from '@/domain/usecases/add-account'

import { map, MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository {
  public async add (accountDto: AddAccountDto): Promise<AccountModel> {
    const accountcollection = await MongoHelper.getCollection('accounts')
    const resultOpInsertAccount = await accountcollection.insertOne(accountDto)
    return map(resultOpInsertAccount.ops[0])
  }
}

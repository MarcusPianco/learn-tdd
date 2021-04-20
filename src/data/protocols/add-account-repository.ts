import { AccountModel } from '@/domain/models/account'
import { AddAccountDto } from '@/domain/usecases/add-account'

export interface AddAccountRepository{
  add: (accountDto: AddAccountDto) => Promise<AccountModel>
}

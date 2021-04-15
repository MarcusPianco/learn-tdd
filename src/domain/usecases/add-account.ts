import { AccountModel } from '../models/account'

export interface AddAccountDto {
  name: string
  email: string
  password: string
}

export interface AddAccount {
  add: (account: AddAccountDto) => Promise<AccountModel>
}

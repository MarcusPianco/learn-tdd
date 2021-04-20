import { AccountModel } from '@/domain/models/account'
import { AddAccountDto } from '@/domain/usecases/add-account'
import { Encrypter,AddAccount,DbAddAccount,AddAccountRepository } from './db-add-account-protocols'

const makeEncryptStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return Promise.resolve('hashed_password')
    }
  }
  const encryptStub = new EncrypterStub()
  return encryptStub
}
const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AddAccountDto): Promise<AccountModel> {
      const fakeAccount = { id: 'valid_id',name: 'valid_name', email: 'valid_email',password: 'hashed_password' }
      return Promise.resolve(fakeAccount)
    }
  }
  return new AddAccountRepositoryStub()
}

interface SutTypes{
  sut: AddAccount
  encryptStub: Encrypter
  addAccountRepository: AddAccountRepository
}

const makeSut = (): SutTypes => {
  const encryptStub = makeEncryptStub()
  const addAccountRepository = makeAddAccountRepository()
  const sut = new DbAddAccount(encryptStub,addAccountRepository)
  return {
    encryptStub,
    addAccountRepository,
    sut
  }
}

describe('DbAddAccount', () => {
  test('Should call Encrypter with correct password',async () => {
    const { encryptStub, sut } = makeSut()
    const accountData = { name: 'valid_name',email: 'valid_email',password: 'valid_password' }

    const encryptSpy = spyOn(encryptStub,'encrypt')
    await sut.add(accountData)

    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })
  test('Should throw if Encrypter throws',async () => {
    const { encryptStub, sut } = makeSut()
    const accountData = { name: 'valid_name',email: 'valid_email',password: 'valid_password' }

    jest.spyOn(encryptStub,'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const promiseAddAccount = sut.add(accountData)

    await expect(promiseAddAccount).rejects.toThrow()
  })
  test('Should call AddaccountRepository with correct data',async () => {
    const { addAccountRepository, sut } = makeSut()
    const accountData = { name: 'valid_name',email: 'valid_email',password: 'valid_password' }

    const addAccountRepoSpy = jest.spyOn(addAccountRepository,'add')
    await sut.add(accountData)

    expect(addAccountRepoSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    })
  })
  test('Should throw if AddAccountRepository throws',async () => {
    const { addAccountRepository, sut } = makeSut()
    const accountData = { name: 'valid_name',email: 'valid_email',password: 'valid_password' }

    jest.spyOn(addAccountRepository,'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promiseAddAccount = sut.add(accountData)

    await expect(promiseAddAccount).rejects.toThrow()
  })

  test('Should return an account if on sucess',async () => {
    const { sut } = makeSut()
    const accountData = { name: 'valid_name',email: 'valid_email',password: 'valid_password' }

    const account = await sut.add(accountData)

    expect(account).toEqual({
      id: 'valid_id',name: 'valid_name',email: 'valid_email',password: 'hashed_password'
    })
  })
})

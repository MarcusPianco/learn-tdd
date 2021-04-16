import { Encrypter } from '@/data/protocols/Encrypter'
import { AddAccount } from '@/domain/usecases/add-account'
import { DbAddAccount } from './db-add-account'

interface SutEncrypter{
  sut: AddAccount
  encryptStub: Encrypter
}

const makeEncryptStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return Promise.resolve('hashed_password')
    }
  }
  const encryptStub = new EncrypterStub()
  return encryptStub
}

const makeSut = (): SutEncrypter => {
  const encryptStub = makeEncryptStub()
  const sut = new DbAddAccount(encryptStub)
  return {
    encryptStub,
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
})

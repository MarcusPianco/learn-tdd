import { Encrypter } from '@/data/protocols/Encrypter'
import { DbAddAccount } from './db-add-account'

describe('DbAddAccount', () => {
  test('Should call Encrypter with correct password',async () => {
    class EncryptStub implements Encrypter {
      async encrypt (value: string): Promise<string> {
        return Promise.resolve('hashed_password')
      }
    }
    const encryptStub = new EncryptStub()
    const sut = new DbAddAccount(encryptStub)
    const accountData = { name: 'valid_name',email: 'valid_email',password: 'valid_password' }
    const encryptSpy = spyOn(encryptStub,'encrypt')

    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })
})

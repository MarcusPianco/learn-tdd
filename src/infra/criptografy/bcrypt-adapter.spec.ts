
import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt',() => ({
  async hash (): Promise<string> {
    return Promise.resolve('any_value_hashed')
  }
}))
describe('Bcrypt Adapter', () => {
  test('should call bcrypt with correct values', async () => {
    const salt = 12
    const sut = new BcryptAdapter(12)

    const bcryptHashSpy = jest.spyOn(bcrypt,'hash')
    await sut.encrypt('any_value')

    expect(bcryptHashSpy).toHaveBeenCalledWith('any_value',salt)
  })
  test('should return a hash on success call bcrypt', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)

    const valueHashed = await sut.encrypt('any_value')

    expect(valueHashed).toBe('any_value_hashed')
  })
})

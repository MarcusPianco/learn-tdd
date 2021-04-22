
import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt',() => ({
  async hash (): Promise<string> {
    return Promise.resolve('any_value_hashed')
  }
}))

interface SutTypes{
  sut: BcryptAdapter
  salt: number
}

const makeSut = (): SutTypes => {
  const salt = 12
  const sut = new BcryptAdapter(salt)
  return {
    sut,
    salt
  }
}

describe('Bcrypt Adapter', () => {
  test('should call bcrypt with correct values', async () => {
    const { sut,salt } = makeSut()

    const bcryptHashSpy = jest.spyOn(bcrypt,'hash')
    await sut.encrypt('any_value')

    expect(bcryptHashSpy).toHaveBeenCalledWith('any_value',salt)
  })
  test('should return a hash on success call bcrypt', async () => {
    const { sut } = makeSut()

    const valueHashed = await sut.encrypt('any_value')

    expect(valueHashed).toBe('any_value_hashed')
  })
  test('should throws if bcrypt throws', async () => {
    const { sut } = makeSut()

    jest.spyOn(bcrypt,'hash').mockReturnValueOnce(
      Promise.reject(new Error('')))

    const promise = sut.encrypt('any_value')

    await expect(promise).rejects.toThrow()
  })
})

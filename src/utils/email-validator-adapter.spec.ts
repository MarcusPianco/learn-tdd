import { EmailValidatorAdapter } from './email-validator'

import validator from 'validator'
// Mockar todas as dependências
jest.mock('validator',() => ({
  isEmail (): boolean {
    return true
  }
}))

describe('Name of the group', () => {
  test('Sould return false if validator lib returs false',() => {
    const sut = new EmailValidatorAdapter()
    jest.spyOn(validator,'isEmail').mockReturnValueOnce(false)

    const isValid = sut.isValid('invalid_email@mail.com')
    expect(isValid).toBe(false)
  })
  test('Sould return false if validator lib returs false',() => {
    const sut = new EmailValidatorAdapter()

    const isValid = sut.isValid('valid_email@mail.com')
    expect(isValid).toBe(true)
  })
})

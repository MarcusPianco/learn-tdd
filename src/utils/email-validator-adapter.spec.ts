import { EmailValidatorAdapter } from './email-validator'

describe('Name of the group', () => {
  test('Sould return false if validator lib returs false',() => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid('invalid_email@mail.com')
    expect(isValid).toBe(false)
  })
})

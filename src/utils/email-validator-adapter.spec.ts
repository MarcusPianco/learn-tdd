import { EmailValidatorAdapter } from './email-validator-adapter'
import validator from 'validator'
// Mockar todas as dependências
jest.mock('validator',() => ({
  isEmail (): boolean {
    return true
  }
}))
const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}
describe('Name of the group', () => {
  test('Sould return false if validator lib returs false',() => {
    const sut = makeSut()
    jest.spyOn(validator,'isEmail').mockReturnValueOnce(false)

    const isValid = sut.isValid('invalid_email@mail.com')
    expect(isValid).toBe(false)
  })
  test('Sould return true if validator lib returs true',() => {
    const sut = makeSut()

    const isValid = sut.isValid('valid_email@mail.com')
    expect(isValid).toBe(true)
  })

  test('Sould call validator with correct data',() => {
    const sut = makeSut()
    const isEmailSpy = jest.spyOn(validator,'isEmail')

    sut.isValid('any_email@mail.com')
    expect(isEmailSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})

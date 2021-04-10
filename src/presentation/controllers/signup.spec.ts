import { InvalidParamsError, MissingParamsError } from '../errors'
import { ServerError } from '../errors/server-error'
import { EmailValidator } from '../protocols'
import { SignUpController } from './signup'

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
}

const mockSut = (): SutTypes => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: String): boolean {
      return true
    }
  }
  const emailValidatorStub = new EmailValidatorStub()
  const sut = new SignUpController(emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}

describe('SignUp Controller', () => {
  test('Should return 400 is name not provide', () => {
    // System Under Test
    const { sut } = mockSut()
    const httpRequest = {
      body: {
        email: 'm@m.com',
        password: 'password',
        confirmPassword: 'password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamsError('name'))
  })
  test('Should return 400 is email not provide', () => {
    // System Under Test
    const { sut } = mockSut()
    const httpRequest = {
      body: {
        name: 'any',
        password: 'password',
        confirmPassword: 'password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamsError('email'))
  })
  test('Should return 400 is email not provide', () => {
    // System Under Test
    const { sut } = mockSut()
    const httpRequest = {
      body: {
        name: 'any',
        email: 'e@e.com',
        confirmPassword: 'password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamsError('password'))
  })
  test('Should return 400 is email not provide', () => {
    // System Under Test
    const { sut } = mockSut()
    const httpRequest = {
      body: {
        name: 'any',
        email: 'e@e.com',
        password: 'password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamsError('confirmPassword'))
  })
  test('Should return 400 is email not valid', () => {
    // System Under Test
    const { sut, emailValidatorStub } = mockSut()
    jest.spyOn(emailValidatorStub,'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: 'any',
        email: 'invalidEmail',
        password: 'password',
        confirmPassword: 'password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamsError('email'))
  })
  test('Should call email validator with correct email request', () => {
    // System Under Test
    const { sut, emailValidatorStub } = mockSut()
    const isValidSpy = jest.spyOn(emailValidatorStub,'isValid')
    const httpRequest = {
      body: {
        name: 'any',
        email: 'any_email@gmail.com',
        password: 'password',
        confirmPassword: 'password'
      }
    }
    sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any_email@gmail.com')
  })
  test('Should return 500 if email validator throws', () => {
    class EmailValidatorStub implements EmailValidator {
      isValid (email: String): boolean {
        throw new Error('')
      }
    }
    const emailValidatorStub = new EmailValidatorStub()
    const sut = new SignUpController(emailValidatorStub)
    const httpRequest = {
      body: {
        name: 'any',
        email: 'invalidEmail',
        password: 'password',
        confirmPassword: 'password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
})

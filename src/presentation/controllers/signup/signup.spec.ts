import { InvalidParamsError, MissingParamsError } from '../../errors'
import { ServerError } from '../../errors/server-error'
import { AccountModel, AddAccount, AddAccountDto, EmailValidator } from './signup-protocols'
import { SignUpController } from './signup'

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

const makeEmailVallidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: String): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}
const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountDto): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'valid_password'
      }
      return Promise.resolve(fakeAccount)
    }
  }
  return new AddAccountStub()
}
const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailVallidator()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)
  return {
    sut,
    emailValidatorStub,
    addAccountStub
  }
}

describe('SignUp Controller', () => {
  test('Should return 400 is name not provide', async () => {
    // System Under Test
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'm@m.com',
        password: 'password',
        confirmPassword: 'password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamsError('name'))
  })
  test('Should return 400 is email not provide', async () => {
    // System Under Test
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any',
        password: 'password',
        confirmPassword: 'password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamsError('email'))
  })
  test('Should return 400 is password not provide', async () => {
    // System Under Test
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any',
        email: 'e@e.com',
        confirmPassword: 'password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamsError('password'))
  })
  test('Should return 400 is confirmPassword not provide', async () => {
    // System Under Test
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any',
        email: 'e@e.com',
        password: 'password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamsError('confirmPassword'))
  })
  test('Should return 400 is passowrdConfirmation fails', async () => {
    // System Under Test
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any',
        email: 'e@e.com',
        password: 'any_password',
        confirmPassword: 'invalid_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamsError('confirmPassword'))
  })
  test('Should return 400 is email not valid', async () => {
    // System Under Test
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub,'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: 'any',
        email: 'invalidEmail',
        password: 'password',
        confirmPassword: 'password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamsError('email'))
  })
  test('Should call email validator with correct email request',async () => {
    // System Under Test
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub,'isValid')
    const httpRequest = {
      body: {
        name: 'any',
        email: 'any_email@gmail.com',
        password: 'password',
        confirmPassword: 'password'
      }
    }
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any_email@gmail.com')
  })
  test('Should return 500 if email validator throws', async () => {
    const { sut,emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub,'isValid').mockImplementationOnce(
      () => { throw new Error('') })

    const httpRequest = {
      body: {
        name: 'any',
        email: 'invalidEmail',
        password: 'password',
        confirmPassword: 'password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
  test('Should call addAccount with correct values', async () => {
    // System Under Test
    const { sut,addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub,'add')
    const httpRequest = {
      body: {
        name: 'any',
        email: 'any_email@gmail.com',
        password: 'password',
        confirmPassword: 'password'
      }
    }
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any',
      email: 'any_email@gmail.com',
      password: 'password'
    })
  })
  test('Should return 500 if AddAccount throws', async () => {
    const { sut,addAccountStub } = makeSut()
    jest.spyOn(addAccountStub,'add').mockImplementationOnce(async () => {
      return Promise.reject(new Error())
    })

    const httpRequest = {
      body: {
        name: 'any',
        email: 'invalidEmail',
        password: 'password',
        confirmPassword: 'password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
  test('Should return 200 is valid data provided', async () => {
    // System Under Test
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'valid_name',
        password: 'valid_password',
        confirmPassword: 'valid_password',
        email: 'valid_email@email.com'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password'
    })
  })
})

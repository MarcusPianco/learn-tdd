import { MissingParamsError } from '../errors/missing-params-erros'
import { SignUpController } from './signup'

const mockSut = (): SignUpController => {
  return new SignUpController()
}

describe('SignUp Controller', () => {
  test('Should return 400 is name not provide', () => {
    // System Under Test
    const sut = mockSut()
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
    const sut = mockSut()
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
    const sut = mockSut()
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
    const sut = mockSut()
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
})

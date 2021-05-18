import { LogErrorRepository } from '@/data/protocols/log-error-repository'
import { serverError } from '@/presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { LoggerControllerDecorator } from './log'

interface SutTypes{
  sut: Controller
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}
const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return Promise.resolve({ body: { name: 'marcus' },statusCode: 200 })
    }
  }
  return new ControllerStub()
}
const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError (stack: string): Promise<void> {
      return Promise.resolve()
    }
  }
  return new LogErrorRepositoryStub()
}
const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  const logErrorRepositoryStub = makeLogErrorRepository()
  const sut = new LoggerControllerDecorator(controllerStub, logErrorRepositoryStub)

  return {
    sut,
    controllerStub,
    logErrorRepositoryStub

  }
}

describe('LogController Decorator', () => {
  test('should call handle main class',async () => {
    const { sut, controllerStub } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_mail@gmail.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'anypassword'
      }
    }
    const handleSpy = jest.spyOn(controllerStub,'handle')
    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  test('should return the same result of main class controller',async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_mail@gmail.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'anypassword'
      }
    }
    const response = await sut.handle(httpRequest)
    expect(response).toEqual({ body: { name: 'marcus' },statusCode: 200 })
  })

  test('should call LogErrorRepository with correct error if controller return a ServerError',async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()

    const fakeError = new Error()
    fakeError.stack = 'any_stack'

    jest.spyOn(controllerStub,'handle').mockReturnValueOnce(Promise.resolve(serverError(fakeError)))
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')

    const httpRequest = {
      body: {
        email: 'any_mail@gmail.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'anypassword'
      }
    }
    await sut.handle(httpRequest)
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})

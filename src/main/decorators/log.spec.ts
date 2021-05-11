import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { LoggerControllerDecorator } from './log'

interface SutTypes{
  sut: Controller
  controllerDecoratorStub: Controller
}
const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return Promise.resolve({ body: { name: 'marcus' },statusCode: 200 })
    }
  }
  return new ControllerStub()
}
const makeSut = (): SutTypes => {
  const controllerDecoratorStub = makeController()
  const sut = new LoggerControllerDecorator(controllerDecoratorStub)

  return {
    sut,
    controllerDecoratorStub
  }
}

describe('LogController Decorator', () => {
  test('should call handle main class',async () => {
    const { sut, controllerDecoratorStub } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_mail@gmail.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'anypassword'
      }
    }
    const handleSpy = jest.spyOn(controllerDecoratorStub,'handle')
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
})

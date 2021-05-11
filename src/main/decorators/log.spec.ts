import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { LoggerControllerDecorator } from './log'

describe('LogController Decorator', () => {
  test('should call handle main class',async () => {
    class ControllerStub implements Controller {
      async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        return Promise.resolve({ body: { name: 'marcus' },statusCode: 200 })
      }
    }
    const controllerStub = new ControllerStub()
    const sut = new LoggerControllerDecorator(controllerStub)
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
})

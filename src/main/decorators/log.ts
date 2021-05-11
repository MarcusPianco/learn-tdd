import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class LoggerControllerDecorator implements Controller {
  private readonly _controller: Controller
  constructor (controller: Controller) {
    this._controller = controller
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const response = await this._controller.handle(httpRequest)
    return response
  }
}

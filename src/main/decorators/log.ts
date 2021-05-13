import { LogErrorRepository } from '@/data/protocols/log-error-repository'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class LoggerControllerDecorator implements Controller {
  private readonly _controller: Controller
  private readonly _logerrorRepository: LogErrorRepository
  constructor (controller: Controller, logErrorRepository: LogErrorRepository) {
    this._controller = controller
    this._logerrorRepository = logErrorRepository
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const response = await this._controller.handle(httpRequest)
    if (response.statusCode === 500) {
      await this._logerrorRepository.log(response.body.stack)
    }
    return response
  }
}

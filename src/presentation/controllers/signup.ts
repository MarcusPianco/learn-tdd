import { MissingParamsError } from '../errors/missing-params-erros'
import { HttpRequest, HttpResponse } from '../protocols/http'
import { badRequest } from '../helpers/http-helper'
export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name','email','password','confirmPassword']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamsError(field))
      }
    }
  }
}

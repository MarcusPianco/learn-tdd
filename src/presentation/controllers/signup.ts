import { MissingParamsError, InvalidParamsError } from '../errors'
import { HttpRequest, HttpResponse } from '../protocols/http'
import { badRequest, serverError } from '../helpers/http-helper'
import { Controller } from '../protocols/controller'
import { EmailValidator } from '../protocols/email-validator'
export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name','email','password','confirmPassword']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamsError(field))
        }
      }
      const emailIsValid = this.emailValidator.isValid(httpRequest.body.email)
      if (!emailIsValid) {
        return badRequest(new InvalidParamsError('email'))
      }
    } catch (error) {
      return serverError()
    }
  }
}

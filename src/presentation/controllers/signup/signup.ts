import { MissingParamsError, InvalidParamsError } from '../../errors'
import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse,EmailValidator, AddAccount } from './signup-protocols'
export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor (emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name','email','password','confirmPassword']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamsError(field))
        }
      }
      const { name,email,password, confirmPassword } = httpRequest.body
      if (confirmPassword !== password) {
        return badRequest(new InvalidParamsError('confirmPassword'))
      }
      const emailIsValid = this.emailValidator.isValid(email)
      if (!emailIsValid) {
        return badRequest(new InvalidParamsError('email'))
      }
      const account = this.addAccount.add({
        name,
        email,
        password
      })
      return ok(account)
    } catch (error) {
      return serverError()
    }
  }
}

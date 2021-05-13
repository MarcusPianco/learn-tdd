export class ServerError extends Error {
  constructor (stackError: string) {
    super('Internal Server Error')
    this.name = 'ServerError'
    this.stack = stackError
  }
}

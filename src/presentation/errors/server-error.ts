export class ServerError extends Error {
  constructor (stack: string) {
    super('Server Internal Error')
    this.name = 'ServerError'
    this.stack = stack
  }
}

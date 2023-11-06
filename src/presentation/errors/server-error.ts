export class ServerError extends Error {
  constructor () {
    super('Server Internal Error')
    this.name = 'ServerError'
  }
}

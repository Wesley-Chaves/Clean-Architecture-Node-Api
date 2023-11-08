import { type IAddAccount, type IAddAccountModel, type IAccountModel, type Encrypter } from './db-add-account-protocols'

export class DbAddAccount implements IAddAccount {
  private readonly encrypter: Encrypter

  constructor (encrypter: Encrypter) {
    this.encrypter = encrypter
  }

  async add (account: IAddAccountModel): Promise<IAccountModel> {
    await this.encrypter.encrypt(account.password)
    return await new Promise(resolve => { resolve(null) })
  }
}

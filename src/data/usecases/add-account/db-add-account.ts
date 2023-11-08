import { type IAccountModel } from '../../../domain/models/account'
import { type IAddAccount, type IAddAccountModel } from '../../../domain/usecases/add-account'
import { type Encrypter } from '../../protocols'

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

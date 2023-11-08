import { type IAccountModel, type IAddAccount, type IAddAccountModel } from '../usecases/add-account/db-add-account-protocols'

export class AddAccountRepository implements IAddAccount {
  async add (account: IAddAccountModel): Promise<IAccountModel> {
    return await new Promise((resolve) => { resolve(null) })
  }
}

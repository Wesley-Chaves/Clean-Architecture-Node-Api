import { type IAccountModel, type IAddAccountModel } from '../usecases/add-account/db-add-account-protocols'

export interface AddAccountRepository {
  add: (account: IAddAccountModel) => Promise<IAccountModel>
}

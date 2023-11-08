import { DbAddAccount } from './db-add-account'
import { type IAccountModel, type IAddAccount, type IAddAccountModel, type Encrypter, type AddAccountRepository } from './db-add-account-protocols'

describe('DbAddAccount Usecase', () => {
  const makeEncrypter = (): Encrypter => {
    class EncrypterStub implements Encrypter {
      async encrypt (value: string): Promise<string> {
        return await new Promise(resolve => { resolve('hashed_value') })
      }
    }
    return new EncrypterStub()
  }

  interface SutTypes {
    sut: DbAddAccount
    encrypterStub: Encrypter
    addAccountRepositoryStub: AddAccountRepository
  }

  const makeSut = (): SutTypes => {
    class AddAccountRepositoryStub implements IAddAccount {
      async add (accountData: IAddAccountModel): Promise<IAccountModel> {
        return await new Promise((resolve) => {
          resolve({
            id: 'valid_id',
            name: accountData.name,
            email: accountData.email,
            password: 'hashed_value'
          })
        })
      }
    }
    const addAccountRepositoryStub = new AddAccountRepositoryStub()
    const encrypterStub = makeEncrypter()
    const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)
    return {
      encrypterStub,
      sut,
      addAccountRepositoryStub
    }
  }

  test('Should call Encrypter with correct value', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountReceived = {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    }
    await sut.add(accountReceived)
    expect(encryptSpy).toHaveBeenCalledWith(accountReceived.password)
  })

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
    const accountReceived = {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    }
    const promise = sut.add(accountReceived)
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addAccountRepositoryStubSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    const accountReceived = {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    }

    await sut.add(accountReceived)
    const treatedAccount = { ...accountReceived, password: 'hashed_value' }
    expect(addAccountRepositoryStubSpy).toHaveBeenCalledWith(treatedAccount)
  })
})

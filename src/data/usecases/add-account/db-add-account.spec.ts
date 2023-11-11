import { DbAddAccount } from './db-add-account'
import { type IAccountModel, type IAddAccount, type IAddAccountModel, type Encrypter, type AddAccountRepository } from './db-add-account-protocols'

describe('DbAddAccount Usecase', () => {
  interface SutTypes {
    sut: DbAddAccount
    encrypterStub: Encrypter
    addAccountRepositoryStub: AddAccountRepository
  }

  const makeEncrypter = (): Encrypter => {
    class EncrypterStub implements Encrypter {
      async encrypt (value: string): Promise<string> {
        return await new Promise(resolve => { resolve('hashed_value') })
      }
    }
    return new EncrypterStub()
  }

  const makeAddAccountRepository = (): AddAccountRepository => {
    class AddAccountRepositoryStub implements IAddAccount {
      async add (accountData: IAddAccountModel): Promise<IAccountModel> {
        return await new Promise((resolve) => resolve(makeFakeAccount()))
      }
    }
    return new AddAccountRepositoryStub()
  }

  const makeFakeAccount = (): IAccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password'
  })

  const makeFakeAccountData = (): IAddAccountModel => ({
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  })

  const makeSut = (): SutTypes => {
    const addAccountRepositoryStub = makeAddAccountRepository()
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
    await sut.add(makeFakeAccountData())
    expect(encryptSpy).toHaveBeenCalledWith('any_password')
  })

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
    const promise = sut.add(makeFakeAccountData())
    await expect(promise).rejects.toThrow()
  })

  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
    const promise = sut.add(makeFakeAccountData())
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addAccountRepositoryStubSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    await sut.add(makeFakeAccountData())
    const treatedAccount = { ...makeFakeAccountData(), password: 'hashed_value' }
    expect(addAccountRepositoryStubSpy).toHaveBeenCalledWith(treatedAccount)
  })

  test('Should return an account on sucess', async () => {
    const { sut } = makeSut()
    const account = await sut.add(makeFakeAccountData())
    expect(account).toEqual(makeFakeAccount())
  })
})

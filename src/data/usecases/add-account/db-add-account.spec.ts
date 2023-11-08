import { DbAddAccount } from './db-add-account'
import { type Encrypter } from '../../protocols'

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
  }

  const makeSut = (): SutTypes => {
    const encrypterStub = makeEncrypter()
    const sut = new DbAddAccount(encrypterStub)
    return {
      encrypterStub,
      sut
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
})

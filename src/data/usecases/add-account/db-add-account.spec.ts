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

  test('Should call Encrypter with correct value', async () => {
    const encrypterStub = makeEncrypter()
    const sut = new DbAddAccount(encrypterStub)
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountReceived = {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    }
    await sut.add(accountReceived)
    expect(encryptSpy).toHaveBeenCalledWith(accountReceived.password)
  })
})

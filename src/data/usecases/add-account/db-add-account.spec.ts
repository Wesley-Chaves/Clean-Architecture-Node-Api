import { DbAddAccount } from './db-add-account'
import { type Encrypter } from '../../protocols'

describe('DbAddAccount Usecase', () => {
  test('Should call Encrypter with correct value', async () => {
    class EncrypterStub implements Encrypter {
      async encrypt (value: string): Promise<string> {
        return await new Promise(resolve => { resolve('hashed_value') })
      }
    }
    const encrypterStub = new EncrypterStub()
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

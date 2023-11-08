import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

// jest.mock('bcrypt', () => ({
//   async hash (): Promise<string> {
//     return await new Promise(resolve => { resolve('hashed_value') })
//   }
// }))

jest.mock('bcrypt', () => {
  const hash = async (value: string, salt: number): Promise<string> => {
    return (
      await new Promise((resolve) => {
        resolve('hashed_value')
      })
    )
  }

  return {
    hash
  }
})

const salt = 12
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
  test('Should call bcrypt with correct values', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('Should return a hash on sucess', async () => {
    const sut = makeSut()
    const hashedValue = await sut.encrypt('any_value')
    expect(hashedValue).toBe('hashed_value')
  })

  test('Should throw if bcrypt throws', async () => {
    const sut = makeSut()
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => { reject(new Error()) })
    })
    const promise = sut.encrypt('any_value')
    await expect(promise).rejects.toThrow()
  })
})

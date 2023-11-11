import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { LogMongoRepository } from './log'

const makeSut = (): LogMongoRepository => {
  return new LogMongoRepository()
}

describe('Log Error Mongo Repository', () => {
  let errorCollection: Collection

  const clearLogs = async (): Promise<void> => {
    errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.deleteMany({})
  }

  beforeAll(async () => {
    await MongoHelper.connect('mongodb://localhost:27017')
    await clearLogs()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    await clearLogs()
  })

  test('Should create an error log on sucess', async () => {
    const sut = makeSut()
    await sut.logError('any_error')
    const count = await errorCollection.countDocuments()
    expect(count).toBe(1)
  })
})

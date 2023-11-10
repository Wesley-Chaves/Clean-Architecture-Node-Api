import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/database/mongodb/helpers/mongo-helper'

describe('SignUp Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect('mongodb://localhost:27017')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountColletion = MongoHelper.getCollection('accounts')
    await accountColletion.deleteMany({})
  })

  test('Should return an account on sucess', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Wesley',
        email: 'Wesleychavesdev@gmail.com',
        password: '123',
        passwordConfirmation: '123'
      })
      .expect(200)
  })
})

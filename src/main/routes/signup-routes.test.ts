import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import request from 'supertest'
import app from '../config/app'

describe('Signup Routes',() => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    const accountcollectio = MongoHelper.getCollection('accounts')
    await accountcollectio.deleteMany({})
  })

  test('should returns signup account success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Marcus',
        email: 'm@m.com',
        password: '123',
        passwordConfirmation: '123'
      })
      .expect(200)
  })
})

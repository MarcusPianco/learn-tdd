import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { LogMongoRepository } from './log'

let logCollection: Collection

describe('Log Mongo Repository',() => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  beforeEach(async () => {
    logCollection = await MongoHelper.getCollection('errors')
    await logCollection.deleteMany({})
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  test('should insert error log register on success',async () => {
    const sut = new LogMongoRepository()
    await sut.logError('any_error')
    const count = await logCollection.countDocuments()
    expect(count).toBe(1)
  })
})

import { MongoHelper as sut } from './mongo-helper'

describe('Mongo Helper',() => {
  beforeAll(async () => {
    await sut.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await sut.disconnect()
  })
  test('should reconnect if mongodn is down',async () => {
    const accountsCollection = await sut.getCollection('accounts')
    expect(accountsCollection).toBeTruthy()
    await sut.disconnect()
    expect(accountsCollection).toBeTruthy()
  })
})

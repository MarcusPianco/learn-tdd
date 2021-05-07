import { MongoHelper as sut } from './mongo-helper'

describe('Mongo Helper',() => {
  beforeEach(async () => {
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

  test('should reconnect if client is null',async () => {
    await sut.disconnect()
    const accountsCollection = await sut.getCollection('accounts')
    expect(accountsCollection).toBeTruthy()
  })
})

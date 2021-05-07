import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  client: null as MongoClient,
  uri: null as string,
  async connect (url: string): Promise<void> {
    this.uri = url
    this.client = await MongoClient.connect(url,{
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  },
  async disconnect (): Promise<void> {
    await this.client.close()
    this.client = null
  },

  async getCollection (name: string): Promise<Collection> {
    if (!this.client?.isconnected) {
      await this.connect(this.uri)
    }
    return this.client.db().collection(name)
  }

}

export const map = (collection: any): any => {
  const { _id, ...collectionWithoutId } = collection
  return Object.assign({},collectionWithoutId,{ id: _id })
}

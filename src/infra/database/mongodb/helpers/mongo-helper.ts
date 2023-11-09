import { MongoClient, type Collection } from 'mongodb'

export const MongoHelper = {
  client: null as MongoClient,

  async connect (url: string): Promise<void> {
    this.client = new MongoClient('mongodb://localhost:27017')
    await this.client.connect()
  },

  async disconnect (): Promise<void> {
    await this.client.close()
  },

  getCollection (name: string): Collection {
    return this.client.db().collection(name)
  },

  map (dataFromSearchDb: any): any {
    const { _id, ...obj } = dataFromSearchDb
    return Object.assign({}, { id: _id }, obj)
  }
}

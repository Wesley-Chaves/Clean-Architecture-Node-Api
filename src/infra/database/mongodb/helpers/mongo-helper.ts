import { MongoClient } from 'mongodb'

export const MongoHelper = {
  client: null as MongoClient,

  async connect (url: string): Promise<void> {
    this.client = new MongoClient('mongodb://localhost:27017')
    await this.client.connect()
  },

  async disconnect (): Promise<void> {
    await this.client.close()
  }
}

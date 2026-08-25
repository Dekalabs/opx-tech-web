import { http } from '@/infrastructure/http'
import PeopleTransformer from '@/infrastructure/transformers/PeopleTransformer'

class PeopleAPI {
  constructor(service) {
    this.service = service
    this.baseURL = '/people'
  }

  async list() {
    const { data } = await this.service.get(this.baseURL)

    return PeopleTransformer.receiveCollection(data.results)
  }
}

export default new PeopleAPI(http)

export default class BaseAPI {
  constructor({ service, baseURL, defaultTransformer = null }) {
    this.service = service
    this.baseURL = baseURL
    this.defaultTransformer = defaultTransformer
  }

  async list({
    url = this.baseURL,
    transformer = this.defaultTransformer,
    config = {},
  } = {}) {
    const { data } = await this.service.get(url, config)
    data.results = transformer.receiveCollection(data.results)
    return data
  }

  async fullList({
    url = this.baseURL,
    transformer = this.defaultTransformer,
    config = {},
    pageSize = 100,
  } = {}) {
    if (!config.params) {
      config.params = {}
    }
    config.params.page_size = pageSize

    const { data } = await this.service.get(url, config)

    let results = transformer.receiveCollection(data.results)

    if (data.next) {
      const nextResults = await this.fullList({
        url: data.next,
        transformer,
        config,
        pageSize,
      })
      results = results.concat(nextResults)
    }
    return results
  }

  async read(
    id,
    {
      url = this.baseURL,
      transformer = this.defaultTransformer,
      config = {},
    } = {},
  ) {
    const { data } = await this.service.get(`${url}${id}/`, config)
    return transformer.fetch(data)
  }

  async create(
    payload,
    {
      url = this.baseURL,
      transformer = this.defaultTransformer,
      config = {},
    } = {},
  ) {
    const transformedPayload = transformer.send(payload)
    const { data } = await this.service.post(url, transformedPayload, config)
    return transformer.fetch(data)
  }

  async update(
    id,
    payload,
    {
      url = this.baseURL,
      transformer = this.defaultTransformer,
      config = {},
    } = {},
  ) {
    const transformedPayload = transformer.send(payload)
    const { data } = await this.service.patch(
      `${url}${id}/`,
      transformedPayload,
      config,
    )
    return transformer.fetch(data)
  }

  delete(id, { url = this.baseURL } = {}) {
    return this.service.delete(`${url}${id}/`)
  }
}

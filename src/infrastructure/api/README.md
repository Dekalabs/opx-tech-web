# API

The infrastructure layer usually has API calls. In fact an API is a way to make operations over stored data, so they are part of the infrastructure layer.

In this folder we will have classes to organize our api endpoints. At the end the API classes are a kind of services.

## Example

For example, imagine that we have this [Swagger OpenAPI](https://swagger.io/specification/) for a garden restful api that has [CRUD](https://developer.mozilla.org/es/docs/Glossary/CRUD) enpoints for the plants:

![api-example](/docs/api-example.png)

This endpoints are all related with the plants. Here we can get all the plants and modify them, add plants, or get a single plant information, modify it or remove it.

So this way, if we want to call this api endpoints that are all related to plants, we will have a class that will have methods to call these endpoints.

```javascript
import { http } from '@/infrastructure/http'
import PlantsTransformer from '@/infrastructure/transformers/PlantsTransformer'
class PlantsAPI {
  defaultTransformer = PlantsTransformer
  baseURL = '/plants/'
  constructor(service) {
    this.service = service
  }
  async list() {
    // ...
  }
  async read(id) {
    // ...
  }
  async create(payload) {
    // ...
  }
  async update(id, payload) {
    // ...
  }
  delete(id) {
    // ..
  }
}
export default new PlantsAPI(http)
```

## Extras

### http import

To be agnostic to the http calls, it is imported the http service and injected in the api constructor.

Typically is used [Axios](https://axios-http.com/), but it can be used the native [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) or even the old [AJAX](https://developer.mozilla.org/en-US/docs/Web/Guide/AJAX).

### Transformers

It is a good idea to be agnostic to the API data. We don't need to stick to the data structure that uses the API, we can have our own data domain.

Transformers are a good way to get API data and transform or adapt them to our domain. Or to get our doimain data and adapt it to the API needs.

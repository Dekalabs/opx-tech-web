# INFRASTRUCTURE LAYER

This directory contains the **infrastructure layer** of our application. The persistence, repository of our data in the application.

This is the lowest layer of all. A common feature of multilayer applications is the use of the repository pattern to communicate with the database or some other external persistence service (like an API). Repository objects are essentially treated as collections, and the layers using them (domain and application) don’t need to know which persistence technology lies underneath.

More info about the `src/infrastructure` folder:

- [`api`](src/infrastructure/api/README.md)
- [`http`](src/infrastructure/http/README.md)
- [`services`](src/infrastructure/services/README.md)
- [`transformers`](src/infrastructure/transformers/README.md)

## References

More information about frontend layers in [this talk and its resources](https://noti.st/afontcu/JHr6wz/the-art-of-front-end-architecture).

[Martin Fowler: Repository](https://martinfowler.com/eaaCatalog/repository.html). Mediates between the domain and data mapping layers using a collection-like interface for accessing domain objects.

Also in this series of [articles of Good Practices in Frontend applications](https://blog.codeminer42.com/nodejs-and-good-practices-354e7d763626/) and [Architecture Fundamentals](https://blog.codeminer42.com/scalable-frontend-1-architecture-9b80a16b8ec7/)

# UI LAYER

This directory contains the **ui (user input) layer** of our application. 

For a better comprehension from the ui framework, this layer structure is going to be at the same level as the [domain layer](domain/README.md), the [app layer](app/README.md) and the [infra layer](infra/README.md).

This layer holds all the entry points of our application. Here is where it remains our view framework, with the graphic user interfaces, visual logic and state management.

This layer is responsible for managing the local and constantly-changing state of your frontend, like the data that's been fetched from the backend, temporary data created in the frontend and not yet persisted, or transient info like the status of a request. In case you’re wondering, that’s the layer where the actions and their handlers responsible for updating the state live.

It should not have any knowledge about business rules, use cases, persistence technologies, and not even about other kinds of logic! It should only receive user input (like URL parameters), pass it on to the use case and finally return a response to the user.

More info about the `src` folder:
  - [`assets`](src/assets/README.md)
  - [`common`](src/common/README.md)
    - [`components`](src/common/components/README.md)
    - [`constants`](src/common/constants/README.md)
    - [`layouts`](src/common/layouts/README.md)
    - [`mixins`](src/common/mixins/README.md)
    - [`utils`](src/common/utils/README.md)
  - [`css`](src/css/README.md)
  - [`locales`](src/locales/README.md)
  - [`plugins`](src/plugins/README.md)
  - [`routes`](src/routes/README.md)
  - [`store`](src/store/README.md)
  - [`views`](src/views/README.md)

## References

More information about frontend layers in [this talk and its resources](https://noti.st/afontcu/JHr6wz/the-art-of-front-end-architecture).

Also in this series of [articles of Good Practices in Frontend applications](https://blog.codeminer42.com/nodejs-and-good-practices-354e7d763626/) and [Architecture Fundamentals](https://blog.codeminer42.com/scalable-frontend-1-architecture-9b80a16b8ec7/)

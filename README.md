<div align="center">
  <h2>Template <br/> Clean Arquitecture + Vite + Vue 3</h2>
  <p>an awesome project from <a href="https://dekalabs.com">Dekalabs</a> 🚀 ⚡️</p>
  <a href="https://github.com/sindresorhus/awesome">
    <img src="https://cdn.rawgit.com/sindresorhus/awesome/d7305f38d29fed78fa85652e3a63e154dd8e8829/media/badge.svg" alt="Awesome">
  </a>
</div>

## Table of Contents

<img src="https://user-images.githubusercontent.com/11247099/112722104-819b8a80-8f42-11eb-82f5-dfc2dd5d8a77.png" height="32" />

Use the "Table of Contents" menu on the top-left corner to explore the list.

`template-clean-vite-vue3`

- [Starter template](#starter-template)
- [Project setup](#project-setup)
- [Project distribution](#project-distribution)
- [Clean Architecture](#clean-architecture)

## Starter template

This starter template includes:

- [Vite](https://vitejs.dev/guide/)
- [Vue 3](https://staging.vuejs.org)
- [Vue Router](https://github.com/vuejs/router)
- [Vue i18n](https://github.com/intlify/vue-i18n-next)
- Http client with [Axios](https://axios-http.com/)
- [Tailwind CSS](https://tailwindcss.com/docs/configuration)
- [PostCSS Preset Env](https://preset-env.netlify.app/features/) - Use tomorrow’s CSS today.
- Linters:
  - [eslint](https://eslint.org/) + [prettier](https://prettier.io/) + [stylelint](https://stylelint.io/) + [lintstaged](https://github.com/okonet/lint-staged)
  - [prettier-plugin-tailwindcss](https://tailwindcss.com/blog/automatic-class-sorting-with-prettier) - Automatic Class Sorting with Prettier
  - [commitlint](https://commitlint.js.org/) to check your commit messages with the [conventional commit format](https://conventionalcommits.org/)
- [Standard Version](https://github.com/conventional-changelog/standard-version) - Automate versioning using [semver](https://semver.org/) and CHANGELOG generation powered by [Conventional Commits](https://conventionalcommits.org/)

### Getting Started

[![Open in Visual Studio Code](https://open.vscode.dev/badges/open-in-vscode.svg)](https://open.vscode.dev/Dekalabs/template-clean-vite-vue3)

```sh
npx degit Dekalabs/template-clean-vite-vue3 vite-vue3-app --mode=git
cd vite-vue3-app
```

### Roadmap

- Form validation:
  - [VeeValidate](https://vee-validate.logaretm.com/v4/)
  - [Vuelidate](https://vuelidate-next.netlify.app/)
- Testing:
  - [Vitest](https://vitest.dev/)
  - [Testing Library](https://github.com/testing-library/vue-testing-library/tree/next)
  - [Vue test utils](https://github.com/vuejs/vue-test-utils)
  - [Peeky](https://peeky.dev/)
  - [Cypress](https://www.cypress.io/), [Cypress component testing](https://docs.cypress.io/guides/component-testing/introduction)
- Store (state management pattern):
  - [Pinia](https://pinia.vuejs.org/)
  - [Provide / Inject](https://staging.vuejs.org/guide/components/provide-inject.html)
- Docker and TravisCI

## Project setup

### Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

### Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)

### Node version

- [lts/gallium, v16](https://nodejs.org/es/about/releases/):
  - _active lts start:_ `2021-10-26`
  - _maintenance lts start:_ `2022-10-18`
  - _end of life:_ `2024-04-30`

Manage node version with [nvm](https://github.com/nvm-sh/nvm)

```sh
nvm use
```

or first install the node version

```sh
nvm install lts/gallium
```

### Compiles and hot-reloads for development

```sh
npm run dev
```

### Lints and fixes files

```sh
npm run lint:js
npm run lint:js:fix
npm run lint:style
npm run lint:style:fix
```

### Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project distribution

For compile a distribution of the project we simply need to lauch vite build and it will do all the magic (optimization, minify, chunk files...)

```sh
npm run build
```

It will create a `dist` folder. Then, we can simply move this files into a web server, or launch it to test with vite preview:

```
npm run serve
```

This is it. But we need to know some things about the environments.

In the project there are 3 environments. All we need are in the `.env` files and in the npm run build tasks.

In the `.env` files all is settled except the `VUE_APP_API_URL` variable for security reasons. You will need to set this variable in your **local env** files that are not published to git and will extend this env files. For example:

`.env.local` will extend and overwrite `.env` file
`.env.pre.local` will extend and overwrite `.env.pre` file
`.env.pro.local` will extend and overwrite `.env.pre` file

### Environments

In the project there can be some environments, depending on the purpose (development or deploy) and the target (staging, production...). This could be more complex depending on the target and purpose. But in general this is a good summary

| Environment   | Target   | npm script          | .env file  | .env.local file  |
| ------------- | -------- | ------------------- | ---------- | ---------------- |
| Development   | Local    | `npm run build`     | `.env`     | `.env.local`     |
| Staging       | Dekalabs | `npm run build`     | `.env`     | `.env.local`     |
| Preproduction | Client ? | `npm run build:pre` | `.env.pre` | `.env.pre.local` |
| Production    | Client ? | `npm run build:pro` | `.env.pro` | `.env.pro.local` |

- The target is one of this: the local server for development, the Dekalabs Staging server, the Client preproduction and production server.
- The npm script could do more things that could be necessary, like setting up in **vite** the distribution mode and the public path where the files will be hosted.
- The `.env` file sets up all the configuration variables needed for the project. Except the `VUE_APP_API_URL` variable for security reasons.
- The `.env.local` file sets up the `VUE_APP_API_URL` variable. This file is not published to git, so you need to create it before the build.

## Clean architecture

Designing software based on the principles of single responsibility and the separation of concerns starts out with the architecture.

The aim of this architecture is to develop and maintain a scalable frontend application which has a good performance and its codebase is maintainable over time.

Architecture is how you make the units of your software interact with each other. Designing the architecture of a software means separating the actual application from its supporting technologies.

One way to separate what is important from what is secondary is by using layers, each with a different and specific set of responsibilities. A common approach in a layer-based architecture is to separate it into four layers: application, domain, infrastructure, and input (user) interfaces (ui)

- [Domain layer](src/domain/README.md): `src/domain`
- [Application layer](src/application/README.md): `src/app`
- [Infrastructure layer](src/infrastructure/README.md): `src/infra`
  - [`api`](src/infrastructure/api/README.md)
  - [`http`](src/infrastructure/http/README.md)
  - [`services`](src/infrastructure/services/README.md)
  - [`transformers`](src/infrastructure/transformers/README.md)
- [Input interfaces (ui) layer](src/ui/README.md): `src`
  - [`assets`](src/ui/assets/README.md)
  - [`pages`](src/ui/pages/README.md)
  - [`plugins`](src/ui/plugins/README.md)
  - [`router`](src/ui/router/README.md)
  - [`styles`](src/ui/styles/README.md)
  - [`locales`](locales/README.md)

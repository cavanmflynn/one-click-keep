# One-Click KEEP

> One-click KEEP and tBTC setup for local app development & testing

<img width="800" src="https://user-images.githubusercontent.com/20102664/94516832-f2f0bf80-01e3-11eb-9f9c-0db037a9b505.png">

## Purpose

One-Click KEEP was built to help [KEEP Network](https://keep.network/) application developers quickly spin up one or more networks locally on their computers.

With One-Click KEEP you can:

* Start all nodes required for local tBTC development on the KEEP network:
    * Bitcoin (1)
    * Ethereum (1)
    * Electrum (1)
    * KEEP ECDSA Node (Up to 9)
    * KEEP Random Beacon Node (Up to 9)
* Open the KEEP Dashboard and tBTC dApp with one-click and interact with the network
* View streaming logs from each node
* Connect from your app to the network via RPC
* View contracts and export artifacts for consumption in integrating projects
* Manually mine new blocks & send bitcoin

Coming Soon
* Trigger conditions from the UI (one-click mint, liquidation scenarios, etc.)
* Manual docker image version selection & custom image support
* Easier consumption in tbtc.js & other tbtc libraries

Have a feature recommendation? Open an issue!

## Development

### Project setup
```
yarn
```

### Compiles and hot-reloads for development
```
yarn start
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Run your unit tests
```
yarn test:unit
```

## Folder Structure

    src/
    ├── api/           # Various API clients, which simplify communication with multiple backends
    ├── components/    # Vue components, which includes both pages and partials
    ├── filters/       # Filters used for text formatting and other transformations
    ├── lib/           # Shared code (Custom classes, functions, modules, etc.)
    ├── localization/  # Language keys and values, which will be used for multi-language support
    ├── scss/          # SCSS used to style the entire application
    ├── services/      # TypeDI services, which can be injected into the Vue prototype for use as plugins
    ├── store/         # The Vuex store, which is used to hold the application's shared state
    ├── types/         # Typescript types and declaration files
    ├── main           # The entry point to the Vue application
    └── router         # The Vue Router, which enables multi-page navigation in the application

    public/
    ├── assets/        # The applications's static assets (images/fonts/etc.)
    ├   └──fonts/      # The applications's font files
    └── index.html     # The applications's HTML entry point

## Libraries
This project makes use of the following libraries for an improved development experience:
* [Vue Class Component](https://class-component.vuejs.org) - A library that lets you make your Vue components in class-style syntax.
* [Ant Design Vue](https://www.antdv.com/docs/vue/introduce) - An enterprise-class UI components based on Ant Design and Vue.
* [TypeDI](https://github.com/typestack/typedi) - Dependency injection tool for JavaScript and TypeScript.

* [Vuex Module Decorators](https://championswimmer.in/vuex-module-decorators) - TypeScript/ES7 Decorators to create Vuex modules declaratively.

## SCSS Namespacing

* The `page` mixin should be used used when creating the top-level class for a page.
* The `partial` mixin should be used used when creating the top-level class for a partial view.

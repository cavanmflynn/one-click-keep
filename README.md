# One-Click KEEP

One-click KEEP and tBTC setup for local app development & testing.

## Getting Started

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
    ├── images/        # Images used on the entire application
    ├── lib/           # Shared code (Custom classes, functions, modules, etc.)
    ├── localization/  # Temporary home of language keys and values, which will be used for multi-language support (should auto-pull from airtable once adding another language)
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

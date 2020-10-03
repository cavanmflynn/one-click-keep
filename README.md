<h1 align="center">
  One-Click KEEP
  <br>
</h1>

<h4 align="center">One-click KEEP networks for local app development & testing</h4>

<p align="center">
  <a href="#purpose">Purpose</a> •
  <a href="#download">Download</a> •
  <a href="#credits">Credits</a> •
  <a href="#development">Development</a> •
  <a href="#license">License</a>
</p>

<p align="center">
  <img width="800px" src="https://user-images.githubusercontent.com/20102664/95001610-be388b80-0588-11eb-95af-a130d96586a5.gif">
</p>

## Purpose

One-Click KEEP was built to help [KEEP Network](https://keep.network/) application developers quickly spin up one or more networks locally on their computers.

**Key Features:**

* Create a local KEEP Network in a few clicks:
   * 1 Bitcoin Node
   * 1 Ethereum Node
   * 1 Electrum Server
   * Up to 9 KEEP ECDSA Nodes
   * Up to 9 KEEP Random Beacon Nodes
* Auto-hosted tBTC dApp & KEEP dashboard instances
* View streaming logs from each node
* Manually mine new Bitcoin & Ethereum blocks
* Send bitcoin to fund deposits
* Export contract artifacts for use in your project
* Connect from your app to the network via RPC
* i18n Ready
* Multiple OS support for Mac, Windows & Linux

Coming Soon:

* Trigger conditions from the UI (one-click mint, liquidation scenarios, etc.)
* Manual docker image version selection & custom image support
* Easier consumption in tbtc.js & other libraries

Have a feature recommendation? DM me in Discord or open an issue!

## Download

You can [download](https://github.com/cavanmflynn/one-click-keep/releases/tag/v0.1.0) the latest installable version of One-Click KEEP for Windows, macOS and Linux.

## Credits

This project was heavily inspired by [Polar](https://github.com/jamaljsr/polar). Check it out if you're a Lightning Network developer or interested in the Lightning Network.

## Development

### Project setup
```
yarn
```

### Compiles and hot-reloads for development
```
yarn electron:serve
```

### Bundles for production
```
yarn electron:build
```

### Lints files
```
yarn lint
```

### Formats files
```
yarn format
```

### Folder Structure

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

### Libraries
This project makes use of the following libraries for an improved development experience:
* [Vue Class Component](https://class-component.vuejs.org) - A library that lets you make your Vue components in class-style syntax.
* [Ant Design Vue](https://www.antdv.com/docs/vue/introduce) - An enterprise-class UI components based on Ant Design and Vue.
* [TypeDI](https://github.com/typestack/typedi) - Dependency injection tool for JavaScript and TypeScript.

* [Vuex Module Decorators](https://championswimmer.in/vuex-module-decorators) - TypeScript/ES7 Decorators to create Vuex modules declaratively.

### SCSS Namespacing

* The `page` mixin should be used used when creating the top-level class for a page.
* The `partial` mixin should be used used when creating the top-level class for a partial view.

## License

[MIT](LICENSE)

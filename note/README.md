# Microfrontend using webpack module federation

## Agenda

1. [What is Microfrontend](#what-is-microfrontend)
1. [What is webpack module federation](#what-is-webpack-module-federation)

## What is Microfrontend

[Microfrontend](https://martinfowler.com/articles/micro-frontends.html) is an architectural style where **independently deliverable** frontend applications are composed into a greater whole.

![Comparisons of frontend architecture](microfrontend.png)

## What is webpack module federation

[Webpack module federation](https://webpack.js.org/concepts/module-federation/) is a webpack feature that allows sharing of modules across builds/applications.

Typical webpack builds looks like below:

![Webpack builds](webpack-builds.png)

With module federation, we can share the module from one webpack build **at runtime** with another webpack build, including dependencies:

![Webpack builds with module federation](webpack-builds-with-mf.png)

### How it looks like in code

1. In the build that intends to share a module, configure webpack [like this](https://github.com/malcolm-kee/federation-mini-app/blob/master/webpack.config.js#L75).
2. In the build that intends to consume a module, configure webpack [like this](../webpack.config.js#L104)
3. Then you can import the shared module using conventional ES Module syntax [like this](../src/App.jsx#L13).

Step 2 and 3 can be skipped as loading remote module can be done dynamically [like this](../src/index.js#L8).

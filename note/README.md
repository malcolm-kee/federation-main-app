# Microfrontend using webpack module federation

## What is Microfrontend

[Microfrontend](https://martinfowler.com/articles/micro-frontends.html) is an architectural style where **independently deliverable** frontend applications are composed into a greater whole.

![Comparisons of frontend architecture](microfrontend.png)

## What is webpack module federation

[Webpack module federation](https://webpack.js.org/concepts/module-federation/) is a webpack feature that allows sharing of modules across builds/applications.

Typical webpack builds looks like below:

![Webpack builds](webpack-builds.png)

With module federation, we can share the module from one webpack build **at runtime** with another webpack build, including dependencies:

![Webpack builds with module federation](webpack-builds-with-mf.png)

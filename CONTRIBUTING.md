# phosphojs contributing guide

phosphojs is implemented with typescript and use tsup to compile to javascript.

## Setup

```
npm i
```

## Running examples scripts

```
npm run examples
```

## Publishing the package

Create a PR on GitHub with your code and create a new package from there.

Don't forget to bump the version up.


## Publishing the package directly (not the usual way)

Follow the versioning rules of npm: https://docs.npmjs.com/about-semantic-versioning

```
npm run build
npm login
npm publish
```

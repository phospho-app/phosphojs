# phospho - Logging

## Introduction

Phospho is a powerful and easy-to-use analytics platform for large language model (LLM) applications. It provides developers with the tools to log, analyze, and understand the interactions between users and their LLM applications.

## Installation

To use Phospho in your Node.js project, install the phospho package:

```bash
npm install phospho
# Or
yarn install phospho
```

- [Npm page](https://www.npmjs.com/package/phospho)
- [Yarn](https://classic.yarnpkg.com/en/package/phospho)

## Usage

You need to have a Phospho account to use this library. If you don't have one, you can sign up for free at [phospho.ai](https://phospho.ai).

### Quickstart

```javascript
import { phospho } from "phospho";

phospho.init({
  apiKey: "...", // Get your API key on phospho.ai
  projectId: "...",
});

// Log a task
phospho
  .log({ input: "User Query", output: "LLM Response" })
  .then((response) => console.log("Log successful:", response))
  .catch((error) => console.error("Error:", error));
```

You only need to do `phospho.init()` once in your app, then you can reuse it accross you whole codebase.

## More Information

For more information, please visit the documentation at [docs.phospho.ai](https://docs.phospho.ai)

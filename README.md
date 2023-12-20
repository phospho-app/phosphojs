# Phospho - LLM App Analytics Platform

## Introduction
Phospho is a powerful and easy-to-use analytics platform for large language model (LLM) applications. It provides developers with the tools to log, analyze, and understand the interactions between users and their LLM applications.

## Installation
To use Phospho in your Node.js project, install it via npm:

```bash
npm install phospho
```


## Usage

You need to have a Phospho account to use this library. If you don't have one, you can sign up for free at [phospho.ai](https://phospho.ai).

### Quickstart

```javascript
const phospho = require('phospho');

// Initialize the Phospho client
const phospho = new Phospho('your_auth_token', 'your_project_id');

// Log an event
phospho.log('User Query', 'LLM Response')
  .then(response => console.log('Log successful:', response))
  .catch(error => console.error('Error:', error));
```

## More Information

For more information, please visit the documentation at [docs.phospho.ai](https://docs.phospho.ai)
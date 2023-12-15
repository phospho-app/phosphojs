# Phospho - LLM App Analytics Platform

## Introduction
Phospho is a powerful and easy-to-use analytics platform for large language model (LLM) applications. It provides developers with the tools to log, analyze, and understand the interactions between users and their LLM applications.

## Installation
To use Phospho in your Node.js project, install it via npm:

```bash
npm install phospho
```


## Usage

### Importing Phospho

```javascript
const phospho = require('phospho');

// Initialize the Phospho client
const phospho = new Phospho('your_auth_token', 'your_project_id');

// Log an event
phospho.log({ input: 'User Query' }, { output: 'LLM Response' })
  .then(response => console.log('Log successful:', response))
  .catch(error => console.error('Error:', error));
```
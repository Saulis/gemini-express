# gemini-express
Plugin for starting up Express when running tests with Gemini

[![Build Status](https://travis-ci.org/Saulis/gemini-express.svg?branch=master)](https://travis-ci.org/Saulis/gemini-express)

## Requirements
Works with [gemini](https://github.com/gemini-testing/gemini) [v0.11](https://github.com/gemini-testing/gemini/releases/tag/v0.11.0) or later.

## Installation 
`npm install gemini-express`

## Configuration
- __root__ (optional) sets the root folder from where the files are hosted. Defaults to `process.cwd()`.
- __port__ (optional) sets the port that is used. Defaults to a random free port.

Set the configuration to your `.gemini.yml`

```
plugins:
  express:
    root: /home/root
    port: 12345
```






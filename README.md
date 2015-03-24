# gemini-express
Plugin for starting up Express when running tests with Gemini

## Notes
Requires a version of gemini that supports plugin loading. See https://github.com/bem/gemini/pull/127

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






# console-dictation

## PROJECT GOALS
> The goal of this project was to make a convenient way to have persistent terminal logging.

- - -

## Installation
```
npm i console-dictation
```
- - -

## Quick Start (CommonJS)

1. Require the package
```js
const dictator = require('console-dictation')
```

2. Use package methods to start logging
```js
dictator.system("Hello, world!")
```
## Quick Start (ESModule)
1. Require the package
```js
import dictator from 'console-dictator'
```

2. Use package methods to start logging
```js
dictator.system("Hello, world!")
```

## Usage

> Documentation below, for examples please see [examples](#examples) and [demos](#demos)

### Configuration

#### Paths
---

By default the paths where the logs are stored are as follows:
System log | Error log | Miscellaneous log
--- | --- | ---
`<CWD>/logs/sys/sys.log`|`<CWD>/logs/error/err.log`|`<CWD>/logs/misc/misc.log`

You can use the `config` method to overwrite or create new logging paths:

```js
const { config } = require('console-dictation')

config({ 
  paths: { <SOME_PATH_KEY>: string, ... }, 
  log_names: { <SOME_PATH_KEY>: string, ... } 
})
```

Where `paths` indicated the log folder path (excluding the file), and the `log_names` indicate the log filename.

#### Indexing
---

console-dictation comes with a disabled indexer out of the box. Enable indexing functionality through the config method:
```js
const { config } = require('console-dictation')

config({ 
  indexing_config: {
    indexing: true
  }
})
```
Indexing has a built-in dependancy array (i.e., X makes a log whenever a log is made in Y):
System log | Error log | Miscellaneous log
--- | --- | ---
`none` | `[system]` | `[system]`

You can pass a new dependancy array of callable logging methods (i.e., `system`, `error`, and `misc`) to replace the dependancies stored in local memory through the config method:
```js
const { config } = require('console-dictation')

config({
  indexing_config: {
    dependencies: {
      SYS: ['misc', 'error'],
      ERR: []
    }
  }
})
```

### Retrieving Configuration

Dictator configuration is stored in local memory. You can use the following commands to find the local configuration.

```js
const { getPaths, getLogNames, getConfig } = require('console-dictation')

let paths = getPaths()          // { PATH_KEY: PATH, ... }

let log_names = getLogNames()   // { LOG_KEY: LOG_FILENAME, ... }

let config = getConfig()        // {PATHS: { PATH_KEY: PATH, ... }, LOG_NAMES: { LOG_KEY: LOG_FILENAME, ... }}, INDEXING_CONFIG: {indexing: boolean, dependencies: {LOG_KEY: []}}
```

### Logs
  
System log | Error log | Miscellaneous log
--- | --- | ---
`system( message: string )` | `error( message: string )` | `misc( message: string )`
`report({ type: 0, message: string })` | `report({ type:1, message: string })` |`report({ type:2, message: string })` |

> Note: `report` with missing `type` parameter or unknown `type` parameter will default to a miscellaneous log.

Each log type includes an optional `path` parameter. This can be used to manually change log path of that specific message:

```js
const { system } = require('console-dictation')

system( message: string, path ?: { PATH: string, LOG_NAME: string } )
```

## Examples

#### Example 1: simple express logging

```js
const dictator = require('console-dictation')
const express = require('express')

const app = express()

app.listen(3000, () => dictator.system(`connected to booking server: port ${port}`))
```
- - -

#### Example 2: utilize destructuring

```js
const { system } = require('console-dictation')
const express = require('express')

const app = express()

app.listen(3000, () => system(`connected to booking server: port ${port}`))
```
- - -

## Demos

This module has two demos prepared for an ESModule/MJS enviroment and a CommonJS enviromment.

### ESModule
> ESM demo code can be found [here](https://github.com/spiltbeans/console-dictation/blob/main/demos/mjs/demo.js).

1. Clone this repo
```
git clone https://github.com/spiltbeans/console-dictation.git
```
2. CD into demo folder
```
cd ./demos/mjs
```
3. Run start script
```
npm start
```
5. Inspect logs

### CommonJS
> CJS demo code can be found [here](https://github.com/spiltbeans/console-dictation/blob/main/demos/cjs/demo.js).

1. Clone this repo
```
git clone https://github.com/spiltbeans/console-dictation.git
```
2. CD into demo folder
```
cd ./demos/cjs
```
3. Run start script
```
npm start
```
5. Inspect logs


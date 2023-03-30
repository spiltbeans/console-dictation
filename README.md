# console-dictation

## PROJECT GOALS
> The main goal of this project was to make a convenient way to have persistent terminal logging.

- - -

## Installation
```
npm i console-dictation
```
- - -

## Quick Start

1. Require the package
```js
const dictator = require('console-dictation')
```

2. Use package methods to start logging
```js
dictator.system("Hello, world!")
```

## Usage

### Configuration

By default the paths where the logs are stored are as follows:
System log | Error log | Miscellaneous log
--- | --- | ---
`<CWD>/logs/sys/sys.log`|`<CWD>/logs/error/err.log`|`<CWD>/logs/misc/misc.log`

You can use the `config` method to overwrite or create new logging paths:

```js
config({ 
  paths: { <SOME_PATH_KEY>: string, ... }, 
  log_names: { <SOME_PATH_KEY>: string, ... } 
})
```

Where `paths` indicated the log folder path (excluding the file), and the `log_names` indicate the log filename.

>Note: logging paths are held as **global** state, meaning helper modules share the same logging paths by default.

### Logs
  
System log | Error log | Miscellaneous log
--- | --- | ---
`system( message: string )` | `error( message: string )` | `misc( message: string )`
`report({ type: 1, message: string })` | `report({ type:0, message: string })` |`report({ type:2, message: string })` |

> Note: `report` with missing `type` parameter or unknown `type` parameter will default to a miscellaneous log.

Each log type includes an optional `path` parameter. This can be used to manually change log path of that specific message:

```js
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
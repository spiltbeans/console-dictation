# console-dictation

## PROJECT GOALS
> The main goal of this project was to make a convenient way to have persistent terminal logging

- - -

## Installation
```
npm i console-dictation
```
- - -
## Usage

1. Require the package, and inline configure the package
```js
let dictator = require('console-dictation').config()
```

Functionality

System log | Error log | Miscellaneous log
--- | --- | ---
system(<message>) | error(<message>) | misc(<message>)
report({type:1, message:<message>}) |report({type:0, message:<message>}) |report({type:2, message:<message>}) |

> Note by defaut, report with only message will print a system log

Example: simple express logging

```js
const dictator = require('console-dictator').config()
const express = require('express')

const app = express()

app.listen(3000, () => system(`connected to booking server: port ${port} `))
```
- - -

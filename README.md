# console-dictation

## Installation

## Usage

1. Require the package, and inline configure the package
```
let dictator = require('console-dictator').config()
```

Functionality

System log | Error log | Miscellaneous log
--- | --- | ---
system(<message>) | error(<message>) | misc(<message>)
report({type:1, message:<message>}) |report({type:0, message:<message>}) |report({type:2, message:<message>}) |

> Note by defaut, report with only message will print a system log

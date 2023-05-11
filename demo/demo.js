const { system, misc, report, config, getConfig } = require('../lib/main')

system('test 1')

system('test 2', {
    PATH: './logs/test',
    LOG_NAME: 'test.log'
})

report({
    type: 1,
    message: 'test 3'
})

report({
    type: 1,
    message: 'test 4',
    path: {
        PATH: './logs/test',
        LOG_NAME: 'test.log'
    }
})

config({
    paths: {
        'SYS': './logs/system'
    },
    log_names: {
        'SYS': 'system.log'
    },
    indexing_config: {
        indexing: true
    }
})

system('test 4')

misc('test 5')

system(JSON.stringify(getConfig()))
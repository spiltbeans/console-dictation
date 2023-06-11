const { system, error, report, config, misc, getConfig } = require('console-dictation')

/**
 * Base tests
 */
system('base system test')
error('base error test')
misc('base misc test')

console.log('current configs', getConfig())

/**
 * config writes
 */

system('system config writes', {
	PATH: './logs/test',
	LOG_NAME: 'test.log'
})

error('error config writes', {
	PATH: './logs/test',
	LOG_NAME: 'test.log'
})

/**
 * Generic writes
 */

report({
    type: 0,
    message: 'generic system write'
})

/**
 * Generic configured writes
 */
report({
    type: 0,
    message: 'generic configured system write',
    path: {
        PATH: './logs/test',
        LOG_NAME: 'test.log'
    }
})

/**
 * Configuration
 */

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

console.log('configs after change', getConfig())
/**
 * Base writes with indexing
 */
system('system base write post-config')

misc('misc base write post-config, 1')
misc('misc base write post-config, 2')
misc('misc base write post-config, 3')
misc('misc base write post-config, 4')

/**
 * Configuring dependencies
 */
config({
    indexing_config: {
		dependencies: {
			SYS: ['misc', 'error']
		}
	}
})

system('system base write post-dependency config')
console.log('configs after config change', getConfig())
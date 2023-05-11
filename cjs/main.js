const fs = require('fs')
const path = require('path')
const { getTimeStamp } = require('./date')
const { isRequestValid } = require('./helper')
const { tracker } = require('./indexer')

/*
* ----------------------------------------------------
*  LOCAL STATE
* ----------------------------------------------------
*/

const PATHS = {
	ERR: path.join(process.cwd(), './logs/error'),
	MISC: path.join(process.cwd(), './logs/misc'),
	SYS: path.join(process.cwd(), './logs/sys')
}
const LOG_NAMES = {
	ERR: 'err.log',
	MISC: 'misc.log',
	SYS: 'sys.log'
}

const INDEXING_CONFIG = {
	indexing: false,
	dependencies:
	{
		ERR: ['system'],
		MISC: ['system'],
		SYS: []
	}
}

const ALIASES = {
	ERR: ['ERR', 'ERROR', '0'],
	SYS: ['SYS', 'SYSTEM', '1'],
	MISC: ['MISC', 'MISCELLANEOUS', '2']
}

const write = (message, file_path, log_name) => {

	const log_path = path.join(file_path, log_name)

	fs.open(log_path, 'wx', (err, fd) => {
		if (err?.code !== 'ENOENT' && err?.code !== 'EEXIST') throw err

		if (err?.code === 'ENOENT') {   //folder not exist
			fs.mkdirSync(file_path, { recursive: true }, err => { if (err) throw err })
			return fs.writeFileSync(log_path, message, err => { if (err) throw err });
		}

		if (err?.code === 'EEXIST') {   //file exists
			return fs.appendFileSync(log_path, message, err => { if (err) throw err })
		}
	})
}


const dictator = {

	config: ({ paths = {}, log_names = {}, indexing_config = {} } = {}) => {

		// error checking - paths and log name keys must match

		if (Object.keys(paths).length !== Object.keys(log_names).length) return "Could not complete config. Path and Log Name keys mismatch"

		const { isValid, message } = isRequestValid(log_names, Object.keys(paths))

		if (!isValid) return `Could not complete config. Path and Log Name keys mismatch. ${message}`

		// no errors

		for (let path_key in paths) (
			PATHS[path_key] = paths[path_key]
		)

		for (let log_key in log_names) (
			LOG_NAMES[log_key] = log_names[log_key]
		)

		for(let indexing_c in indexing_config){
			if(INDEXING_CONFIG.hasOwnProperty(indexing_c)) INDEXING_CONFIG[indexing_c] = indexing_config[indexing_c]
		}
	},
	error: (message, path = {}, reference = false) => {

		// check if a path is manually passed in
		const { isValid } = isRequestValid(path, ['PATH', 'LOG_NAME'])

		const log_message = `${getTimeStamp()} \t ${(INDEXING_CONFIG.indexing && !reference) ? `issue #${tracker.increment(0)} \t ` : ''}${message}\n`

		isValid ? (
			write(log_message, path?.PATH, path?.LOG_NAME)
		) : (
			write(log_message, PATHS.ERR, LOG_NAMES.ERR)
		)

		if (INDEXING_CONFIG.indexing) {
			for (let dependency of INDEXING_CONFIG.dependencies.ERR) {
				dictator?.[dependency](`error issued: issue #${tracker.ERR}`, {}, true)
			}
		}
	},
	system: (message, path = {}, reference = false) => {

		// check if a path is manually passed in
		const { isValid } = isRequestValid(path, ['PATH', 'LOG_NAME'])

		const log_message = `${getTimeStamp()} \t ${(INDEXING_CONFIG.indexing && !reference) ? `issue #${tracker.increment(1)} \t ` : ''}${message}\n`

		isValid ? (
			write(log_message, path?.PATH, path?.LOG_NAME)
		) : (
			write(log_message, PATHS.SYS, LOG_NAMES.SYS)
		)
		if (INDEXING_CONFIG.indexing) {
			for (let dependency of INDEXING_CONFIG.dependencies.SYS) {
				dictator?.[dependency](`system issued: issue #${tracker.SYS}`, {}, true)
			}
		}
	},
	misc: (message, path = {}, reference = false) => {

		// check if a path is manually passed in
		const { isValid } = isRequestValid(path, ['PATH', 'LOG_NAME'])

		const log_message = `${getTimeStamp()} \t ${(INDEXING_CONFIG.indexing && !reference) ? `issue #${tracker.increment(2)} \t ` : ''}${message}\n`

		isValid ? (
			write(log_message, path?.PATH, path?.LOG_NAME)
		) : (
			write(log_message, PATHS.MISC, LOG_NAMES.MISC)
		)
		if (INDEXING_CONFIG.indexing) {
			for (let dependency of INDEXING_CONFIG.dependencies.MISC) {
				dictator?.[dependency](`misc issued: issue #${tracker.MISC}`, {}, true)
			}
		}

	},
	report: ({ type, message, path = {} } = {}) => {
		if (!type) return dictator.misc(message, path)

		if (ALIASES.ERR.includes(type.toString())) {
			dictator.error(message, path)
		} else if (ALIASES.SYS.includes(type.toString())) {
			dictator.system(message, path)
		} else {
			dictator.misc(message, path)
		}
	},
	getPaths: () => {
		return PATHS
	},
	getLogNames: () => {
		return LOG_NAMES
	},
	getConfig: () => {
		return { PATHS, LOG_NAMES }
	}
}

module.exports = dictator
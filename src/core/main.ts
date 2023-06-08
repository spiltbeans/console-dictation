import fs from 'fs'
import path from 'path'
import { getTimeStamp } from '../utils/date'
import { isRequestValid } from '../utils/validator'
import { tracker } from '../utils/indexer'
import { PATHS, LOG_NAMES, INDEXING_CONFIG, ALIASES } from './config'

/*
* ----------------------------------------------------
*  METHODS
* ----------------------------------------------------
*/

const write = (
	message: string,
	file_path: string,
	log_name: string
) => {
	try {
		const log_path = path.join(file_path, log_name)

		if (fs.existsSync(log_path)) {
			const fd = fs.openSync(log_path, 'w')		// 'w': Open file for writing. The file is created (if it does not exist) or truncated (if it exists).
			fs.appendFileSync(fd, message, 'utf8')
		} else {
			const fd = fs.openSync(log_path, 'w')		// 'w': Open file for writing. The file is created (if it does not exist) or truncated (if it exists).
			fs.writeFileSync(fd, message);
		}
	} catch (err) {
		throw new Error((err as Error | NodeJS.ErrnoException).toString())
	}
}


export const dictator = {

	config: (
		{
			paths = {},
			log_names = {},
			indexing_config = {}
		}: IndexingConfigOptions
	) => {

		// error checking - paths and log name keys must match

		const { isValid, message } = isRequestValid(log_names, Object.keys(paths))

		if (!isValid) throw new Error(`Could not complete config. Paths and Log Names keys mismatch. \n${message}`)

		// no errors

		for (let path_key in paths) (
			PATHS[path_key] = paths[path_key]
		)

		for (let log_key in log_names) (
			LOG_NAMES[log_key] = log_names[log_key]
		)

		if (indexing_config.hasOwnProperty('indexing') && indexing_config.indexing !== undefined) INDEXING_CONFIG.indexing = indexing_config.indexing
		if (indexing_config.hasOwnProperty('dependencies') && indexing_config.dependencies !== undefined) INDEXING_CONFIG.dependencies = indexing_config.dependencies

	},
	system: (
		message: string,
		path: CustomPath = {},
		isDependency: boolean = false
	) => {

		// check if a path is manually passed in
		const { isValid } = isRequestValid(path, ['PATH', 'LOG_NAME'])

		const log_message: string = `${getTimeStamp()} \t ${INDEXING_CONFIG.indexing && !isDependency ? `issue #${tracker.increment(0)} \t` : ''}${message} \n`

		if (isValid) {
			write(log_message, path.PATH as string, path.LOG_NAME as string)
		} else {
			write(log_message, PATHS.SYS as string, LOG_NAMES.SYS as string)
		}

		if (INDEXING_CONFIG.indexing && !isDependency) {
			for (const dependency of INDEXING_CONFIG.dependencies.SYS as (keyof typeof CallableWrites)[]) {
				dictator?.[dependency](`system issued: issue #${tracker.SYS} `, {}, true)
			}
		}
	},
	error: (
		message: string,
		path: CustomPath = {},
		isDependency: boolean = false
	) => {

		// check if a path is manually passed in
		const { isValid } = isRequestValid(path, ['PATH', 'LOG_NAME'])

		const log_message: string = `${getTimeStamp()} \t ${INDEXING_CONFIG.indexing && !isDependency ? `issue #${tracker.increment(1)} \t` : ''}${message} \n`

		if (isValid) {
			write(log_message, path.PATH as string, path.LOG_NAME as string)
		} else {
			write(log_message, PATHS.ERR as string, LOG_NAMES.ERR as string)
		}

		if (INDEXING_CONFIG.indexing && !isDependency) {
			for (const dependency of INDEXING_CONFIG.dependencies.ERR as (keyof typeof CallableWrites)[]) {
				dictator?.[dependency](`error issued: issue #${tracker.ERR} `, {}, true)
			}
		}
	},

	misc: (
		message: string,
		path: CustomPath = {},
		isDependency: boolean = false
	) => {

		// check if a path is manually passed in
		const { isValid } = isRequestValid(path, ['PATH', 'LOG_NAME'])

		const log_message: string = `${getTimeStamp()} \t ${INDEXING_CONFIG.indexing && !isDependency ? `issue #${tracker.increment(2)} \t` : ''}${message} \n`

		if (isValid) {
			write(log_message, path.PATH as string, path.LOG_NAME as string)
		} else {
			write(log_message, PATHS.MISC as string, LOG_NAMES.MISC as string)
		}


		if (INDEXING_CONFIG.indexing && !isDependency) {
			for (const dependency of INDEXING_CONFIG.dependencies.MISC as (keyof typeof CallableWrites)[]) {
				dictator?.[dependency](`misc issued: issue #${tracker.MISC} `, {}, true)
			}
		}

	},
	report: (
		{
			type,
			message,
			path = {}
		}: {
			type: string,
			message: string,
			path: CustomPath
		}
	) => {
		if (ALIASES.SYS.includes(type.toString())) {
			dictator.system(message, path)
		} else if (ALIASES.ERR.includes(type.toString())) {
			dictator.error(message, path)
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
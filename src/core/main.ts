import fs from 'fs'
import path from 'path'
import { getTimeStamp } from '../utils/date'
import { isRequestValid } from '../utils/validator'
import { tracker } from '../utils/indexer'
import { PATHS, LOG_NAMES, INDEXING_CONFIG, ALIASES } from './config'
import type { IndexingConfigOptions, CustomPath, CallableWrites } from '../@types/index'

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
			const fd = fs.openSync(log_path, 'a')			// 'w': Open file for writing. The file is created (if it does not exist) or truncated (if it exists).
			fs.appendFileSync(fd, message, 'utf8')
		} else {
			fs.mkdirSync(file_path, { recursive: true })	// we can't use juts openSync with w because the file directories may not have been created
			const fd = fs.openSync(log_path, 'w')			// 'w': Open file for writing. The file is created (if it does not exist) or truncated (if it exists).
			fs.writeFileSync(fd, message);
		}
	} catch (err) {
		throw new Error((err as Error | NodeJS.ErrnoException).toString())
	}
}


const dictator = {

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

		for (let path_key in paths) {
			PATHS[path_key] = paths[path_key]
		}

		for (let log_key in log_names) {
			LOG_NAMES[log_key] = log_names[log_key]
		}

		if (indexing_config.hasOwnProperty('indexing') && indexing_config.indexing !== undefined) INDEXING_CONFIG.indexing = indexing_config.indexing
		if (indexing_config.hasOwnProperty('dependencies') && indexing_config.dependencies !== undefined) {
			for (let dependency_key in indexing_config.dependencies) {
				INDEXING_CONFIG.dependencies[dependency_key] = indexing_config.dependencies[dependency_key]
			}
		}
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
			write(log_message, PATHS.sys as string, LOG_NAMES.sys as string)
		}

		if (INDEXING_CONFIG.indexing && !isDependency) {
			for (const dependency of INDEXING_CONFIG.dependencies.sys as (keyof typeof CallableWrites)[]) {
				dictator?.[dependency](`system issued: issue #${tracker.sys} `, {}, true)
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
			write(log_message, PATHS.err as string, LOG_NAMES.err as string)
		}

		if (INDEXING_CONFIG.indexing && !isDependency) {
			for (const dependency of INDEXING_CONFIG.dependencies.err as (keyof typeof CallableWrites)[]) {
				dictator?.[dependency](`error issued: issue #${tracker.err} `, {}, true)
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
			write(log_message, PATHS.misc as string, LOG_NAMES.misc as string)
		}


		if (INDEXING_CONFIG.indexing && !isDependency) {
			for (const dependency of INDEXING_CONFIG.dependencies.misc as (keyof typeof CallableWrites)[]) {
				dictator?.[dependency](`misc issued: issue #${tracker.misc} `, {}, true)
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
		if (ALIASES.sys.includes(type.toString())) {
			dictator.system(message, path)
		} else if (ALIASES.err.includes(type.toString())) {
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
		return { PATHS, LOG_NAMES, INDEXING_CONFIG }
	}
}

export default dictator
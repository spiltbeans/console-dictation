import { tracker } from './indexer'
import { PATHS, LOG_NAMES, INDEXING_CONFIG, ALIASES } from '../core/config'
import fs from 'fs/promises'
import path from 'path'
const KNOWN_CONFIG = ['dictator.config.json']

const attemptLoadConfig = async () => {
	try {
		const filepath = path.resolve(process.cwd(), KNOWN_CONFIG[0])

		const file_contents = await fs.readFile(filepath, { encoding: 'utf8' })
		const config = JSON.parse(file_contents)

		// do some loading
		if (config?.['tracker'] !== undefined && typeof config.tracker === 'object') {
			for (let key in config.tracker) {
				if (tracker.hasOwnProperty(key) && !isNaN(config.tracker[key])) tracker[key] = config.tracker[key]
			}
		}

		if (config?.['aliases'] !== undefined && typeof config.aliases === 'object') {
			for (let key in config.aliases) {
				if (ALIASES.hasOwnProperty(key) && Array.isArray(config.aliases[key]) && (config.aliases[key]).some(e => isNaN(e))) ALIASES[key] = config.aliases[key]
			}
		}

		if (config?.['indexing'] !== undefined) {

			if (config.indexing?.['indexing'] !== undefined && typeof config.indexing?.['indexing'] === 'boolean') INDEXING_CONFIG.indexing = config.indexing.indexing

			if (config.indexing?.['dependencies'] !== undefined && typeof config.indexing.dependencies === 'object') {

				for (let key in config.indexing.dependencies) {
					const existsInDep = (INDEXING_CONFIG.dependencies).hasOwnProperty(key)
					const configIsArray = Array.isArray(config.indexing.dependencies[key])
					const arrayIsApprovedStrings = (config.indexing.dependencies[key]).some(e => (e === 'system' || e === 'error' || e === 'misc'))
					if (existsInDep && configIsArray && arrayIsApprovedStrings) INDEXING_CONFIG.dependencies[key] = config.indexing.dependencies[key]
				}
			}

		}

		if (config?.paths !== undefined && typeof config.paths === 'object') {
			// log keys should be the same for both, so we don't need to check twice

			for (let key in config.paths) {
				if (PATHS.hasOwnProperty(key) && typeof config.paths[key] === 'string') {
					const links = (config.paths[key]).split('/')

					// testing if it has a file extension
					if (!(links[links.length - 1]).includes('.')) return {
						status: 'error',
						message: 'expected file path. received directory'
					}

					LOG_NAMES[key] = links[links.length - 1]
					// note: path difference https://hackernoon.com/whats-the-difference-between-pathjoin-and-pathresolve
					PATHS[key] = path.join(process.cwd(), ...links.slice(0, -1))
				}
			}
		}
		return {
			status: 'ok',
			message: 'successfully loaded'
		}

	} catch (e) {
		if (e.code === 'ENOENT') return {
			status: 'warn',
			message: `file doesn't exist`
		}

		return {
			status: 'error',
			message: `encountered a problem reading dictator config file:\n\t${e.toString()}`
		}
	}
}
const writeConfig = async (config) => {
	try {
		const filepath = path.resolve(process.cwd(), KNOWN_CONFIG[0])
		await fs.writeFile(filepath, JSON.stringify(config, null, 2))	// options for readability
	} catch (e) {
		return console.error(`encountered a problem writing to the dictator config file:\n\t${e.toString()}`)
	}
}

const normalizeConfig = () => {
	const config = {
		'tracker': {},
		'aliases': {},
		'indexing': {},
		'paths': {}
	}

	for (let key in tracker) {
		config['tracker'][key] = tracker[key]
	}

	for (let key in ALIASES) {
		config['aliases'][key] = ALIASES[key]
	}

	for (let key in INDEXING_CONFIG) {
		config['indexing'][key] = INDEXING_CONFIG[key]
	}

	for (let key in LOG_NAMES) {
		config['paths'][key] = path.join(PATHS[key], LOG_NAMES[key])
	}

	return config
}

const loadConfig = async () => {
	const { status, message } = await attemptLoadConfig()

	if (status === 'error') return console.error(message)

	// write system defaults
	if (status === 'warn') return writeConfig(normalizeConfig())
}


export { loadConfig }
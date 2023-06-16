import path from 'path'
import type { Paths, LogNames, IndexingConfig, Aliases } from '../@types/index'

export const PATHS: Paths = {
	sys: path.join(process.cwd(), './logs/sys'),
	err: path.join(process.cwd(), './logs/error'),
	misc: path.join(process.cwd(), './logs/misc')
}
export const LOG_NAMES: LogNames = {
	sys: 'sys.log',
	err: 'err.log',
	misc: 'misc.log'
}

export const INDEXING_CONFIG: IndexingConfig = {
	indexing: false,
	dependencies:
	{
		sys: [],
		err: ['system'],
		misc: ['system']
	}
}

export const ALIASES: Aliases = {
	"sys": [
		"sys",
		"system",
		"0"
	],
	"err": [
		"err",
		"error",
		"1"
	],
	"misc": [
		"misc",
		"miscellaneous",
		"2"
	]
}
import path from 'path'

export const PATHS: PATHS = {
	ERR: path.join(process.cwd(), './logs/error'),
	MISC: path.join(process.cwd(), './logs/misc'),
	SYS: path.join(process.cwd(), './logs/sys')
}
export const LOG_NAMES: LOG_NAMES = {
	ERR: 'err.log',
	MISC: 'misc.log',
	SYS: 'sys.log'
}

export const INDEXING_CONFIG: IndexingConfig = {
	indexing: false,
	dependencies:
	{
		ERR: ['system'],
		MISC: ['system'],
		SYS: []
	}
}

export const ALIASES: ALIASES = {
	SYS: ['SYS', 'SYS', '0'],
	ERR: ['ERR', 'ERR', '1'],
	MISC: ['MISC', 'MISCELLANEOUS', '2']
}
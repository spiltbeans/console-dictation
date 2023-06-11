interface GenericPaths {
	SYS?: string,
	ERR?: string,
	MISC?: string,
	[log_slug: string]: string
}

interface isValidRequest extends GenericPaths { }

interface PATHS extends GenericPaths { }

interface LOG_NAMES extends GenericPaths { }

interface ALIASES {
	[log_slug: string]: (string | undefined)[]
}

type RequestValidatorResponse = {
	isValid: boolean,
	message: string
}

type IndexingConfig = {
	indexing: boolean,
	dependencies: {
		SYS?: (keyof typeof CallableWrites | undefined)[],
		ERR?: (keyof typeof CallableWrites | undefined)[],
		MISC?: (keyof typeof CallableWrites | undefined)[],
		[log_slug: string]: (keyof typeof CallableWrites | undefined)[]
	}
}

interface IndexingConfigOptions {
	paths?: PATHS,
	log_names?: LOG_NAMES,
	indexing_config?: {
		indexing?: boolean,
		dependencies?: {
			[log_slug: string]: (keyof typeof CallableWrites | undefined)[]
		}
	}
}

interface CustomPath {
	PATH?: string,
	LOG_NAME?: string
}

enum CallableWrites {
	system,
	error,
	misc
}
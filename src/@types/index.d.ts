export interface GenericPaths {
	sys?: string,
	err?: string,
	misc?: string,
	[log_slug: string]: string
}

export interface isValidRequest extends GenericPaths { }

export interface Paths extends GenericPaths { }

export interface LogNames extends GenericPaths { }

export interface Aliases {
	[log_slug: string]: (string | undefined)[]
}

export type RequestValidatorResponse = {
	isValid: boolean,
	message: string
}

export type IndexingConfig = {
	indexing: boolean,
	dependencies: {
		sys?: (keyof typeof CallableWrites | undefined)[],
		err?: (keyof typeof CallableWrites | undefined)[],
		misc?: (keyof typeof CallableWrites | undefined)[],
		[log_slug: string]: (keyof typeof CallableWrites | undefined)[]
	}
}

export interface IndexingConfigOptions {
	paths?: Paths,
	log_names?: LogNames,
	indexing_config?: {
		indexing?: boolean,
		dependencies?: {
			[log_slug: string]: (keyof typeof CallableWrites | undefined)[]
		}
	}
}

export interface CustomPath {
	PATH?: string,
	LOG_NAME?: string
}

export enum CallableWrites {
	system,
	error,
	misc
}
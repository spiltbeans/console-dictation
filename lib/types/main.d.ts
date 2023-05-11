declare function write(message: string, file_path: string, log_name: string): void

interface PATHS {
	[log_id: string]: string
}

interface LOG_NAMES {
	[log_id: string]: string
}

interface COptions {
	paths?: PATHS,
	log_names?: LOG_NAMES,
	indexing_config?: {
		indexing?: boolean,
		dependencies?: {
			[log_id: string]: Array<string>
		}
	}
}

interface CustomPath {
	path: {
		PATH: string,
		LOG_NAME: string
	}
}

interface ROptions {
	type: string,
	message: string,
	path?: CustomPath,
}
export declare interface dictator {
	config: (opts?: COptions) => void
	error: (message: string, path?: CustomPath, reference?: boolean) => void
	system: (message: string, path?: CustomPath, reference?: boolean) => void
	misc: (message: string, path?: CustomPath, reference?: boolean) => void
	report: (opts: ROptions) => void
	getPaths: () => PATHS
	getLogNames: () => LOG_NAMES
	getConfig: () => { PATHS: PATHS, LOG_NAMES: LOG_NAMES }

}
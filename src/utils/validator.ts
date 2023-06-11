import type { isValidRequest, CustomPath, RequestValidatorResponse } from '../@types/index';

const isRequestValid = (
	request: isValidRequest | CustomPath,
	params: string[]
): RequestValidatorResponse => {
	if (Object.keys(request).length !== params.length) {
		return {
			isValid: false,
			message: 'Could not complete config. Paths and Log Names key length mismatch.'
		}
	}

	const missing = []

	for (const param in request) {
		if (!params.includes(param)) missing.push(param)
	}

	return {
		isValid: (missing.length < 1),
		message: missing.join('\n')
	}
}

export { isRequestValid }
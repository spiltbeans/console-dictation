import typescript from '@rollup/plugin-typescript';
export default [
	{
		input: 'src/index.ts',
		output: {
			file: 'dist/mjs/index.mjs',
			format: 'es',
			exports: 'named',
			generatedCode: {
				constBindings: true
			}
		},
		plugins: [typescript()]
	}
]
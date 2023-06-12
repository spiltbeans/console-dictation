import package_details from './package.json'
import dts from 'rollup-plugin-dts'

export default [
	{
		input: './.build/index.js',
		output: [
			{
				file: package_details.exports['.'].import.default,
				format: 'es',
				exports: 'named',
				generatedCode: {
					constBindings: true
				}
			},
			{
				file: package_details.exports['.'].require.default,
				format: 'commonjs',
				exports: 'named',
				generatedCode: {
					constBindings: true
				}
			},
		],
	},
	{
		input: './src/@types/index.d.ts',
		output: [
			{
				file: './.build/@types/index.d.ts',
				format: 'es'
			}
		],
		plugins: [dts.default()],
	},
	{
		input: './.build/index.d.ts',
		output: [
			{
				file: package_details.types,
				format: 'es'
			}
		],
		plugins: [dts.default()],
	}
]
import dts from 'rollup-plugin-dts'
export default [
	{
		input: './src/@types/index.d.ts',
		output: [
			{
				file: 'dist/types/@types/index.d.ts',
				format: 'es'
			}
		],
		plugins: [dts.default()],
	},
	{
		input: 'dist/types/index.d.ts',
		output: [
			{
				file: 'dist/@types/index.d.ts',
				format: 'es',
			}
		],
		plugins: [dts.default()],
	}
]
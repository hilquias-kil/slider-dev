import babel from 'rollup-plugin-babel';

export default {
	entry: 'src/main.js',
	dest: 'dist/slider.js',
	format: 'umd',
	moduleName: 'Slider',
	plugins: [
		babel({
			exclude: 'node_modules/**',
		}),
	],
};
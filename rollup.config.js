import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import commonjs from 'rollup-plugin-commonjs';
import svelte from 'rollup-plugin-svelte';
import babel from 'rollup-plugin-babel';
import {
	terser
} from 'rollup-plugin-terser';
import config from 'sapper/config/rollup.js';
import postcss from 'rollup-plugin-postcss';
import sass from 'sass';
import pkg from './package.json';

const mode = process.env.NODE_ENV;
const dev = mode === 'development';
const legacy = !!process.env.SAPPER_LEGACY_BUILD;

const preprocess ={
	style: ({ content, attributes }) => {
		if (attributes.lang !== 'scss') return;
		return new Promise((resolve, reject) => {
			sass.render({
				data: content,
				includePaths: ['src', 'node_modules'],
				sourceMap: true,
				outFile: 'x' // this is necessary, but is ignored
			}, (err, result) => {
				if (err) return reject(err);

				resolve({
					code: result.css.toString(),
					map: result.map.toString()
				});
			});
		});
	}
};
const onwarn = warning => {
	if (warning.code !== 'css-unused-selector') {
		console.warn(warning.message);
		console.warn(warning.frame);
	}
}

export default {
	client: {
		input: config.client.input(),
		output: config.client.output(),
		plugins: [
			replace({
				'process.browser': true,
				'process.env.NODE_ENV': JSON.stringify(mode)
			}),
			postcss(),
			svelte({
				dev,
				hydratable: true,
				emitCss: true,
				preprocess,
				onwarn,
			}),
			resolve(),
			commonjs(),

			legacy && babel({
				extensions: ['.js', '.mjs', '.html', '.svelte'],
				runtimeHelpers: true,
				exclude: ['node_modules/@babel/**'],
				presets: [
					['@babel/preset-env', {
						targets: '> 0.25%, not dead'
					}]
				],
				plugins: [
					'@babel/plugin-syntax-dynamic-import',
					['@babel/plugin-transform-runtime', {
						useESModules: true
					}]
				]
			}),

			!dev && terser({
				module: true
			})
		],
	},

	server: {
		input: config.server.input(),
		output: config.server.output(),
		plugins: [
			replace({
				'process.browser': false,
				'process.env.NODE_ENV': JSON.stringify(mode)
			}),
			postcss(),
			svelte({
				generate: 'ssr',
				preprocess,
				onwarn,
				dev
			}),
			resolve(),
			commonjs()
		],
		external: Object.keys(pkg.dependencies).concat(
			require('module').builtinModules || Object.keys(process.binding('natives'))
		),
	},

	serviceworker: {
		input: config.serviceworker.input(),
		output: config.serviceworker.output(),
		plugins: [
			resolve(),
			replace({
				'process.browser': true,
				'process.env.NODE_ENV': JSON.stringify(mode)
			}),
			commonjs(),
			!dev && terser()
		]
	}
};
import uglify from 'rollup-plugin-uglify';
import babel from 'rollup-plugin-babel';
import typescript from 'rollup-plugin-typescript2';

const plugins = [
    typescript({
        tsconfig: 'tsconfig.json'
    }),
    babel({
        presets: [
            ['es2015-rollup'],
            'stage-0'
        ],
        plugins: [
            'transform-object-assign'
        ]
    })
];

export default [
    {
        input: 'src/index.ts',
        output: {
            name: 'Tms',
            file: 'dist/tms.js',
            format: 'umd'
        },
        plugins
    },
    {
        input: 'src/index.ts',
        output: {
            name: 'Tms',
            file: 'dist/tms.min.js',
            format: 'umd'
        },
        plugins: [
            ...plugins,
            uglify()
        ]
    },
    {
        input: 'src/index.ts',
        output: {
            file: 'dist/tms.esm.js',
            format: 'es'
        },
        plugins
    },
    {
        input: 'src/index.ts',
        output: {
            file: 'dist/tms.common.js',
            format: 'cjs'
        },
        plugins
    }
];

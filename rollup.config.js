import minify from 'rollup-plugin-babel-minify';
import resolve from 'rollup-plugin-node-resolve';

function onwarn(warning) {
  if (warning.code === 'THIS_IS_UNDEFINED')
    return;
  console.error(warning.message);
}

export default [
  {
    input: '3/carrot.js',
    output: {
      file: `3/carrot.min.js`,
      format: 'iife',
      name: 'carrot'
    },
    onwarn,
    plugins: [resolve(), minify({ comments: false })]
  }
];
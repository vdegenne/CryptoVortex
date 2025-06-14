import typescript from '@rollup/plugin-typescript';
import nodeResolve from '@rollup/plugin-node-resolve';
// import json from '@rollup/plugin-json'
import cjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser';


export default {
  input: 'src/front/monitoring-app.ts',
  output: { file: 'monitoring-app.js', format: 'esm', sourcemap: true },
  plugins: [
    typescript({ sourceMap: true }),
    cjs(),
    nodeResolve(),
  // json(),
    process.env.minify ? terser() : {},
  ]
}
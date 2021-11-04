import { babel }     from '@rollup/plugin-babel';        // Babel is used for private class fields for browser usage.
// import svelte        from 'rollup-plugin-svelte';
import resolve       from '@rollup/plugin-node-resolve';
import sourcemaps    from 'rollup-plugin-sourcemaps';
import { terser }    from 'rollup-plugin-terser';

import terserConfig  from './terser.config.js';

const s_COMPRESS = false;
const s_SOURCEMAPS = true;

export default () =>
{
   // Defines potential output plugins to use conditionally if the .env file indicates the bundles should be
   // minified / mangled.
   const outputPlugins = [];
   if (s_COMPRESS)
   {
      outputPlugins.push(terser(terserConfig));
   }

   // Defines whether source maps are generated / loaded from the .env file.
   const sourcemap = s_SOURCEMAPS;

   return [{
      input: 'src/modules/index.js',
      external: [
         'svelte', 'svelte/easing', 'svelte/internal', 'svelte/motion', 'svelte/store', 'svelte/transition',
          'svelte/types'
      ],
      output: {
         file: 'dist/modules/index.js',
         format: 'es',
         plugins: outputPlugins,
         sourcemap,
         // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
      },
      plugins: [
         resolve(),
         sourcemaps(),
         babel({
            babelHelpers: 'bundled',
            presets: [
               ['@babel/preset-env', {
                  bugfixes: true,
                  shippedProposals: true,
                  targets: { esmodules: true }
               }]
            ]
         })
      ]
   },
   {
      input: 'src/modules/handler/index.js',
      external: [
         'svelte', 'svelte/easing', 'svelte/internal', 'svelte/motion', 'svelte/store', 'svelte/transition',
          'svelte/types'
      ],
      output: {
         file: 'dist/modules/handler.js',
         format: 'es',
         plugins: outputPlugins,
         sourcemap,
         // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
      }
   },
   {
      input: 'src/modules/helper/index.js',
      external: [
         'svelte', 'svelte/easing', 'svelte/internal', 'svelte/motion', 'svelte/store', 'svelte/transition',
          'svelte/types'
      ],
      output: {
         file: 'dist/modules/helper.js',
         format: 'es',
         plugins: outputPlugins,
         sourcemap,
         // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
      }
   },
   {
      input: 'src/modules/store/index.js',
      external: [
       'svelte', 'svelte/easing', 'svelte/internal', 'svelte/motion', 'svelte/store', 'svelte/transition',
         'svelte/types'
      ],
      output: {
         file: 'dist/modules/store.js',
         format: 'es',
         plugins: outputPlugins,
         sourcemap,
         // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
      },
      plugins: [
         resolve(),
         sourcemaps(),
         babel({
            babelHelpers: 'bundled',
            presets: [
               ['@babel/preset-env', {
                  bugfixes: true,
                  shippedProposals: true,
                  targets: { esmodules: true }
               }]
            ]
         })
      ]
   },
   {
      input: 'src/modules/transition/index.js',
      external: [
         'svelte', 'svelte/easing', 'svelte/internal', 'svelte/motion', 'svelte/store', 'svelte/transition',
          'svelte/types'
      ],
      output: {
         file: 'dist/modules/transition.js',
         format: 'es',
         plugins: outputPlugins,
         preferConst: true,
         sourcemap,
         // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
      },
      plugins: [
         resolve(),
         sourcemaps()
      ]
   },
   {
      input: 'src/modules/util/index.js',
      external: [
         'svelte', 'svelte/easing', 'svelte/internal', 'svelte/motion', 'svelte/store', 'svelte/transition',
          'svelte/types'
      ],
      output: {
         file: 'dist/modules/util.js',
         format: 'es',
         plugins: outputPlugins,
         preferConst: true,
         sourcemap,
         // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
      },
      plugins: [
         resolve(),
         sourcemaps()
      ]
   },
   {
      input: 'src/plugins/data/index.js',
      external: [
         'svelte', 'svelte/easing', 'svelte/internal', 'svelte/motion', 'svelte/store', 'svelte/transition',
          'svelte/types'
      ],
      output: {
         file: 'dist/plugins/data.js',
         format: 'es',
         plugins: outputPlugins,
         sourcemap,
         // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
      }
   },
   {
      input: 'src/plugins/system/index.js',
      external: [
         'svelte', 'svelte/easing', 'svelte/internal', 'svelte/motion', 'svelte/store', 'svelte/transition',
          'svelte/types'
      ],
      output: {
         file: 'dist/plugins/system.js',
         format: 'es',
         plugins: outputPlugins,
         sourcemap,
         // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
      },
      plugins: [
         resolve(),
         sourcemaps()
      ]
   }];
};
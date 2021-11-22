import path                from 'path';

import { babel }           from '@rollup/plugin-babel';        // Babel is used for private class fields for browser usage.
import resolve             from '@rollup/plugin-node-resolve';
import { generateTSDef }   from '@typhonjs-build-test/esm-d-ts';
import fs                  from 'fs-extra';
import { rollup }          from 'rollup';
import sourcemaps          from 'rollup-plugin-sourcemaps';
import { terser }          from 'rollup-plugin-terser';
import upath               from 'upath';

import terserConfig  from './terser.config.mjs';

const s_COMPRESS = false;
const s_SOURCEMAPS = true;

// Defines Svelte and all local exports as external.
const s_LOCAL_EXTERNAL = [
   'svelte', 'svelte/easing', 'svelte/internal', 'svelte/motion', 'svelte/store', 'svelte/transition',
   'svelte/types',

   '@typhonjs-svelte/lib/handler', '@typhonjs-svelte/lib/helper', '@typhonjs-svelte/lib/store',
   '@typhonjs-svelte/lib/transition', '@typhonjs-svelte/lib/util', '@typhonjs-svelte/lib/plugin/data',
   '@typhonjs-svelte/lib/plugin/system',
]

// Defines potential output plugins to use conditionally if the .env file indicates the bundles should be
// minified / mangled.
const outputPlugins = s_COMPRESS ? [terser(terserConfig)] : [];

// Defines whether source maps are generated / loaded from the .env file.
const sourcemap = s_SOURCEMAPS;

const rollupConfigs = [{
      input: {
         input: 'src/handler/index.js',
         external: s_LOCAL_EXTERNAL,
      },
      output: {
         output: {
            file: 'dist/handler/index.js',
            format: 'es',
            plugins: outputPlugins,
            sourcemap,
            // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
         }
      }
   },
   {
      input: {
         input: 'src/helper/index.js',
         external: s_LOCAL_EXTERNAL,
      },
      output: {
         output: {
            file: 'dist/helper/index.js',
            format: 'es',
            plugins: outputPlugins,
            sourcemap,
            // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
         }
      }
   },
   {
      input: {
         input: 'src/store/index.js',
         external: s_LOCAL_EXTERNAL,
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
      output: {
         output: {
            file: 'dist/store/index.js',
            format: 'es',
            plugins: outputPlugins,
            sourcemap,
            // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
         }
      }
   },
   {
      input: {
         input: 'src/transition/index.js',
         external: s_LOCAL_EXTERNAL,
         plugins: [
            resolve(),
            sourcemaps()
         ]
      },
      output: {
         output: {
            file: 'dist/transition/index.js',
            format: 'es',
            plugins: outputPlugins,
            preferConst: true,
            sourcemap,
            // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
         }
      }
   },
   {
      input: {
         input: 'src/util/index.js',
         external: s_LOCAL_EXTERNAL,
         plugins: [
            resolve(),
            sourcemaps()
         ]
      },
      output: {
         output: {
            file: 'dist/util/index.js',
            format: 'es',
            plugins: outputPlugins,
            preferConst: true,
            sourcemap,
            // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
         }
      }
   },
   {
      input: {
         input: 'src/plugin/data/index.js',
         external: s_LOCAL_EXTERNAL
      },
      output: {
         output: {
            file: 'dist/plugin/data/index.js',
            format: 'es',
            plugins: outputPlugins,
            sourcemap,
            // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
         }
      }
   },
   {
      input: {
         input: 'src/plugin/system/index.js',
         external: s_LOCAL_EXTERNAL,
         plugins: [
            resolve(),
            sourcemaps()
         ]
      },
      output: {
         output: {
            file: 'dist/plugin/system/index.js',
            format: 'es',
            plugins: outputPlugins,
            sourcemap,
            // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
         }
      }
   }
];

for (const config of rollupConfigs)
{
   const bundle = await rollup(config.input);

   await bundle.write(config.output);

   // closes the bundle
   await bundle.close();

   await generateTSDef({
      main: config.output.output.file,
      output: upath.changeExt(config.output.output.file, '.d.ts')
   });

   fs.writeJSONSync(`${path.dirname(config.output.output.file)}/package.json`, {
      "main": "./index.mjs",
      "module": "./index.mjs",
      "types": "./index.d.ts"
   });
}

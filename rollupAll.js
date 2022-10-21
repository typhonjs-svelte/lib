import path                from 'path';

import resolve             from '@rollup/plugin-node-resolve';
import { generateTSDef }   from '@typhonjs-build-test/esm-d-ts';
import fs                  from 'fs-extra';
import { rollup }          from 'rollup';
import upath               from 'upath';

const s_SOURCEMAPS = true;

// Defines Svelte and all local exports as external.
const s_LOCAL_EXTERNAL = [
   'svelte', 'svelte/easing', 'svelte/internal', 'svelte/motion', 'svelte/store', 'svelte/transition',
   'svelte/types',

   '@typhonjs-svelte/lib/action', '@typhonjs-svelte/lib/animation', '@typhonjs-svelte/lib/handler',
   '@typhonjs-svelte/lib/helper', '@typhonjs-svelte/lib/math', '@typhonjs-svelte/lib/store',
   '@typhonjs-svelte/lib/transition', '@typhonjs-svelte/lib/util', '@typhonjs-svelte/lib/plugin/data',
   '@typhonjs-svelte/lib/plugin/system'
];

// Defines potential output plugins to use conditionally if the .env file indicates the bundles should be
// minified / mangled.
const outputPlugins = [];

// Defines whether source maps are generated / loaded from the .env file.
const sourcemap = s_SOURCEMAPS;

const rollupConfigs = [{
      input: {
         input: 'src/action/index.js',
         external: s_LOCAL_EXTERNAL,
      },
      output: {
         file: 'dist/action/index.js',
         format: 'es',
         generatedCode: { constBindings: true },
         plugins: outputPlugins,
         sourcemap,
         // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
      }
   },
   {
      input: {
         input: 'src/animate/index.js',
         external: s_LOCAL_EXTERNAL,
      },
      output: {
         file: 'dist/animate/index.js',
         format: 'es',
         generatedCode: { constBindings: true },
         plugins: outputPlugins,
         sourcemap,
         // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
      }
   },
   {
      input: {
         input: 'src/handler/index.js',
         external: s_LOCAL_EXTERNAL,
      },
      output: {
         file: 'dist/handler/index.js',
         format: 'es',
         generatedCode: { constBindings: true },
         plugins: outputPlugins,
         sourcemap,
         // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
      }
   },
   {
      input: {
         input: 'src/helper/index.js',
         external: s_LOCAL_EXTERNAL,
      },
      output: {
         file: 'dist/helper/index.js',
         format: 'es',
         generatedCode: { constBindings: true },
         plugins: outputPlugins,
         sourcemap,
         // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
      }
   },
   {
      input: {
         input: 'src/math/index.js',
         external: s_LOCAL_EXTERNAL,
         plugins: [
            resolve()
         ]
      },
      output: {
         file: 'dist/math/index.js',
         format: 'es',
         generatedCode: { constBindings: true },
         plugins: outputPlugins,
         sourcemap,
         // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
      }
   },
   {
      input: {
         input: 'src/store/index.js',
         external: s_LOCAL_EXTERNAL,
         plugins: [
            resolve()
         ]
      },
      output: {
         file: 'dist/store/index.js',
         format: 'es',
         generatedCode: { constBindings: true },
         plugins: outputPlugins,
         sourcemap,
         // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
      }
   },
   {
      input: {
         input: 'src/transition/index.js',
         external: s_LOCAL_EXTERNAL,
         plugins: [
            resolve()
         ]
      },
      output: {
         file: 'dist/transition/index.js',
         format: 'es',
         generatedCode: { constBindings: true },
         plugins: outputPlugins,
         sourcemap,
         // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
      }
   },
   {
      input: {
         input: 'src/util/index.js',
         external: s_LOCAL_EXTERNAL,
         plugins: [
            resolve()
         ]
      },
      output: {
         file: 'dist/util/index.js',
         format: 'es',
         generatedCode: { constBindings: true },
         plugins: outputPlugins,
         sourcemap,
         // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
      }
   },
   {
      input: {
         input: 'src/plugin/data/index.js',
         external: s_LOCAL_EXTERNAL
      },
      output: {
         file: 'dist/plugin/data/index.js',
         format: 'es',
         generatedCode: { constBindings: true },
         plugins: outputPlugins,
         sourcemap,
         // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
      }
   },
   {
      input: {
         input: 'src/plugin/system/index.js',
         external: s_LOCAL_EXTERNAL,
         plugins: [
            resolve()
         ]
      },
      output: {
         file: 'dist/plugin/system/index.js',
         format: 'es',
         generatedCode: { constBindings: true },
         plugins: outputPlugins,
         sourcemap,
         // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
      }
   }
];

for (const config of rollupConfigs)
{
   console.log(`Generating bundle: ${config.input.input}`);
// console.log(`config input: `, config.input);
// console.log(`config output: `, config.output);

   const bundle = await rollup(config.input);

   await bundle.write(config.output);

   // closes the bundle
   await bundle.close();

   console.log(`Generating TS Declaration: ${config.input.input}`);

   await generateTSDef({
      main: config.input.input,
      output: upath.changeExt(config.output.file, '.d.ts')
   });

   fs.writeJSONSync(`${path.dirname(config.output.file)}/package.json`, {
      main: './index.js',
      module: './index.js',
      type: 'module',
      types: './index.d.ts'
   });
}

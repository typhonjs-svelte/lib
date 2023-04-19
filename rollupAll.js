import resolve             from '@rollup/plugin-node-resolve';
import { generateDTS }     from '@typhonjs-build-test/esm-d-ts';
import { rollup }          from 'rollup';

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

// GenerateDTS options -----------------------------------------------------------------------------------------------

// Provides naive search / replace of bundled declaration file rewriting the re-bundled definitions from
// @typhonjs-svelte/lib. This will alter the JSDoc comments and import symbols.
const replace = {
   _typhonjs_svelte_lib_: '_typhonjs_fvtt_svelte_',
   '@typhonjs-svelte/lib/': '@typhonjs-fvtt/svelte/'
};

/**
 * Filter out "Duplicate identifier 'DOMRect'" messages.
 *
 * TODO: NOTE - The filtering of 2300 is unwanted churn, but 1014 can be a valid error though currently there is no
 * great way to describe destructuring rest parameters as a function argument with JSDoc that Typescript agrees with.
 * See this issue:
 *
 * @param {import('typescript').Diagnostic} diagnostic -
 *
 * @param {string} message -
 *
 * @returns {boolean} Return true to filter message.
 */
const filterDiagnostic = (diagnostic, message) =>
 (diagnostic.code === 2300 && message === `Duplicate identifier 'DOMRect'.`) ||
 (diagnostic.code === 1014 && message === `A rest parameter must be last in a parameter list.`);

// We don't care about external warning messages for `@typhonjs-svelte/lib` imports.
const ignorePattern = /^@typhonjs-svelte\/lib/;

const onwarn = (warning, warn) =>
{
   if (warning.code === 'UNRESOLVED_IMPORT' && ignorePattern.test(warning.exporter)) { return; }
   warn(warning);
};

// Rollup plugin options for generateDTS.
const dtsPluginOptions = { bundlePackageExports: true, filterDiagnostic, onwarn };

// -------------------------------------------------------------------------------------------------------------------

const rollupConfigs = [{
      input: {
         input: 'src/action/index.js',
         external: s_LOCAL_EXTERNAL,
         plugins: [
            generateDTS.plugin(dtsPluginOptions)
         ]
      },
      output: {
         file: 'dist/action/index.js',
         format: 'es',
         generatedCode: { constBindings: true },
         plugins: outputPlugins,
         sourcemap
      }
   },
   {
      input: {
         input: 'src/animate/index.js',
         external: s_LOCAL_EXTERNAL,
         plugins: [
            generateDTS.plugin(dtsPluginOptions)
         ]
      },
      output: {
         file: 'dist/animate/index.js',
         format: 'es',
         generatedCode: { constBindings: true },
         plugins: outputPlugins,
         sourcemap
      }
   },
   {
      input: {
         input: 'src/handler/index.js',
         external: s_LOCAL_EXTERNAL,
         plugins: [
            generateDTS.plugin(dtsPluginOptions)
         ]
      },
      output: {
         file: 'dist/handler/index.js',
         format: 'es',
         generatedCode: { constBindings: true },
         plugins: outputPlugins,
         sourcemap
      }
   },
   {
      input: {
         input: 'src/helper/index.js',
         external: s_LOCAL_EXTERNAL,
         plugins: [
            generateDTS.plugin(dtsPluginOptions)
         ]
      },
      output: {
         file: 'dist/helper/index.js',
         format: 'es',
         generatedCode: { constBindings: true },
         plugins: outputPlugins,
         sourcemap
      }
   },
   {
      input: {
         input: 'src/math/index.js',
         external: s_LOCAL_EXTERNAL,
         plugins: [
            resolve(),
            generateDTS.plugin(dtsPluginOptions)
         ]
      },
      output: {
         file: 'dist/math/index.js',
         format: 'es',
         generatedCode: { constBindings: true },
         plugins: outputPlugins,
         sourcemap
      }
   },
   {
      input: {
         input: 'src/store/index.js',
         external: s_LOCAL_EXTERNAL,
         plugins: [
            resolve(),
            generateDTS.plugin(dtsPluginOptions)
         ]
      },
      output: {
         file: 'dist/store/index.js',
         format: 'es',
         generatedCode: { constBindings: true },
         plugins: outputPlugins,
         sourcemap
      }
   },
   {
      input: {
         input: 'src/store/position/index.js',
         external: s_LOCAL_EXTERNAL,
         plugins: [
            resolve(),
            generateDTS.plugin({ ...dtsPluginOptions, prependGen: ['src/store/position/typedefs.js'] })
         ]
      },
      output: {
         file: 'dist/store/position/index.js',
         format: 'es',
         generatedCode: { constBindings: true },
         plugins: outputPlugins,
         sourcemap
      }
   },
   {
      input: {
         input: 'src/transition/index.js',
         external: s_LOCAL_EXTERNAL,
         plugins: [
            resolve(),
            generateDTS.plugin(dtsPluginOptions)
         ]
      },
      output: {
         file: 'dist/transition/index.js',
         format: 'es',
         generatedCode: { constBindings: true },
         plugins: outputPlugins,
         sourcemap
      }
   },
   {
      input: {
         input: 'src/util/index.js',
         external: s_LOCAL_EXTERNAL,
         plugins: [
            resolve(),
            generateDTS.plugin(dtsPluginOptions)
         ]
      },
      output: {
         file: 'dist/util/index.js',
         format: 'es',
         generatedCode: { constBindings: true },
         plugins: outputPlugins,
         sourcemap
      }
   },
   {
      input: {
         input: 'src/plugin/data/index.js',
         external: s_LOCAL_EXTERNAL,
         plugins: [
            generateDTS.plugin(dtsPluginOptions)
         ]
      },
      output: {
         file: 'dist/plugin/data/index.js',
         format: 'es',
         generatedCode: { constBindings: true },
         plugins: outputPlugins,
         sourcemap
      }
   },
   {
      input: {
         input: 'src/plugin/system/index.js',
         external: s_LOCAL_EXTERNAL,
         plugins: [
            resolve(),
            generateDTS.plugin(dtsPluginOptions)
         ]
      },
      output: {
         file: 'dist/plugin/system/index.js',
         format: 'es',
         generatedCode: { constBindings: true },
         plugins: outputPlugins,
         sourcemap
      }
   }
];

for (const config of rollupConfigs)
{
   console.log(`Generating bundle: ${config.input.input}`);

   const bundle = await rollup(config.input);
   await bundle.write(config.output);
   await bundle.close();
}

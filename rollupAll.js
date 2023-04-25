import resolve             from '@rollup/plugin-node-resolve';
import { generateDTS }     from '@typhonjs-build-test/esm-d-ts';
import { importsExternal } from '@typhonjs-build-test/rollup-external-imports';
import { rollup }          from 'rollup';

const sourcemap = true; // Defines whether source maps are generated.

// Bundle all top level external package exports.
const dtsPluginOptions = { bundlePackageExports: true };

// -------------------------------------------------------------------------------------------------------------------

const rollupConfigs = [{
      input: {
         input: 'src/action/index.js',
         plugins: [
            importsExternal(),
            generateDTS.plugin(dtsPluginOptions)
         ]
      },
      output: {
         file: '_dist/action/index.js',
         format: 'es',
         generatedCode: { constBindings: true },
         sourcemap
      }
   },
   {
      input: {
         input: 'src/animate/index.js',
         plugins: [
            importsExternal(),
            generateDTS.plugin(dtsPluginOptions)
         ]
      },
      output: {
         file: '_dist/animate/index.js',
         format: 'es',
         generatedCode: { constBindings: true },
         sourcemap
      }
   },
   {
      input: {
         input: 'src/animate/action/index.js',
         plugins: [
            importsExternal(),
            generateDTS.plugin(dtsPluginOptions)
         ]
      },
      output: {
         file: '_dist/animate/action/index.js',
         format: 'es',
         generatedCode: { constBindings: true },
         sourcemap
      }
   },
   {
      input: {
         input: 'src/handler/index.js',
         plugins: [
            importsExternal(),
            generateDTS.plugin(dtsPluginOptions)
         ]
      },
      output: {
         file: '_dist/handler/index.js',
         format: 'es',
         generatedCode: { constBindings: true },
         sourcemap
      }
   },
   {
      input: {
         input: 'src/helper/index.js',
         plugins: [
            importsExternal(),
            generateDTS.plugin(dtsPluginOptions)
         ]
      },
      output: {
         file: '_dist/helper/index.js',
         format: 'es',
         generatedCode: { constBindings: true },
         sourcemap
      }
   },
   {
      input: {
         input: 'src/math/index.js',
         plugins: [
            importsExternal(),
            resolve(),
            generateDTS.plugin({ ...dtsPluginOptions, replace: {
               '/// <reference types="gl-matrix/index.js" />': '',  // Remove reference in __dist/math/index.d.ts
               "export \\* from 'gl-matrix';": ''
            } })
         ]
      },
      output: {
         file: '_dist/math/index.js',
         format: 'es',
         generatedCode: { constBindings: true },
         sourcemap
      }
   },
   {
      input: {
         input: 'src/store/index.js',
         plugins: [
            importsExternal(),
            resolve(),
            generateDTS.plugin(dtsPluginOptions)
         ]
      },
      output: {
         file: '_dist/store/index.js',
         format: 'es',
         generatedCode: { constBindings: true },
         sourcemap
      }
   },
   {
      input: {
         input: 'src/store/position/index.js',
         plugins: [
            importsExternal(),
            resolve(),
            generateDTS.plugin(dtsPluginOptions)
         ]
      },
      output: {
         file: '_dist/store/position/index.js',
         format: 'es',
         generatedCode: { constBindings: true },
         sourcemap
      }
   },
   {
      input: {
         input: 'src/transition/index.js',
         plugins: [
            importsExternal(),
            resolve(),
            generateDTS.plugin(dtsPluginOptions)
         ]
      },
      output: {
         file: '_dist/transition/index.js',
         format: 'es',
         generatedCode: { constBindings: true },
         sourcemap
      }
   },
   {
      input: {
         input: 'src/util/index.js',
         plugins: [
            importsExternal(),
            resolve(),
            generateDTS.plugin(dtsPluginOptions)
         ]
      },
      output: {
         file: '_dist/util/index.js',
         format: 'es',
         generatedCode: { constBindings: true },
         sourcemap
      }
   },
   {
      input: {
         input: 'src/plugin/data/index.js',
         plugins: [
            importsExternal(),
            generateDTS.plugin(dtsPluginOptions)
         ]
      },
      output: {
         file: '_dist/plugin/data/index.js',
         format: 'es',
         generatedCode: { constBindings: true },
         sourcemap
      }
   },
   {
      input: {
         input: 'src/plugin/system/index.js',
         plugins: [
            importsExternal(),
            resolve(),
            generateDTS.plugin(dtsPluginOptions)
         ]
      },
      output: {
         file: '_dist/plugin/system/index.js',
         format: 'es',
         generatedCode: { constBindings: true },
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

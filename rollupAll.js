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
         file: 'dist/action/index.js',
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
         file: 'dist/animate/index.js',
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
         file: 'dist/handler/index.js',
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
         file: 'dist/helper/index.js',
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
               '/// <reference types="gl-matrix/index.js" />': '',  // Remove reference in dist/math/index.d.ts
               "export \\* from 'gl-matrix';": ''
            } })
         ]
      },
      output: {
         file: 'dist/math/index.js',
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
         file: 'dist/store/index.js',
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
         file: 'dist/store/position/index.js',
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
         file: 'dist/transition/index.js',
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
         file: 'dist/util/index.js',
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
         file: 'dist/plugin/data/index.js',
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
         file: 'dist/plugin/system/index.js',
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

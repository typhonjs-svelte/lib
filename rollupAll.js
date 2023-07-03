import resolve             from '@rollup/plugin-node-resolve';
import { generateDTS }     from '@typhonjs-build-test/esm-d-ts';
import { importsExternal } from '@typhonjs-build-test/rollup-plugin-pkg-imports';
import { rollup }          from 'rollup';

const sourcemap = true; // Defines whether source maps are generated.

// Bundle all top level external package exports.
const dtsPluginOptions = {
   bundlePackageExports: true,
   dtsReplace: { '/\\/\\/ <reference.*\\/>': '' } // Svelte v4 types currently add triple slash references.
};

// -------------------------------------------------------------------------------------------------------------------

const rollupConfigs = [
   // Just leaving this here to be filled in by future exports...
   // {
   //    input: {
   //       input: 'src/<SOME_PATH>/index.js',
   //       plugins: [
   //          importsExternal(),
   //          resolve(),
   //          generateDTS.plugin(dtsPluginOptions)
   //       ]
   //    },
   //    output: {
   //       file: '_dist/<SOME_PATH>/index.js',
   //       format: 'es',
   //       generatedCode: { constBindings: true },
   //       sourcemap
   //    }
   // }
];

for (const config of rollupConfigs)
{
   console.log(`Generating bundle: ${config.input.input}`);

   const bundle = await rollup(config.input);
   await bundle.write(config.output);
   await bundle.close();
}

import { isObject }           from '@typhonjs-utils/object';

import { isSvelteComponent }  from './isSvelteComponent.js';

/**
 * Validates `config` argument whether it is a valid {@link TJSSvelteConfig}.
 *
 * @param {*}  config - The potential config object to validate.
 *
 * @param {boolean}  [raiseException=false] - If validation fails raise an exception.
 *
 * @returns {boolean} Is the config a valid TJSSvelteConfig.
 *
 * @throws {TypeError}  Any validation error when `raiseException` is enabled.
 */
export function isTJSSvelteConfig(config, raiseException = false)
{
   if (!isObject(config))
   {
      if (raiseException) { throw new TypeError(`isTJSSvelteConfig error: 'config' is not an object.`); }
      return false;
   }

   if (!isSvelteComponent(config.class))
   {
      if (raiseException)
      {
         throw new TypeError(`isTJSSvelteConfig error: 'config.class' is not a Svelte component constructor.`);
      }
      return false;
   }

   return true;
}

/**
 * @typedef {object} TJSSvelteConfig
 *
 * @property {{ new(options: import('#svelte').ComponentConstructorOptions): import('#svelte').SvelteComponent | import('#svelte').SvelteComponentTyped }} class -
 *
 * @property {Element|Document|ShadowRoot}   [target=document.body] -
 *
 * @property {Element} [anchor] -
 *
 * @property {() => Record<string, *> | Record<string, *>} [props] -
 *
 * @property {() => (Record<string, *> | Map<string, *>) | Map<string, *> | Record<string, *>} [context] -
 *
 * @property {boolean}  [hydrate] -
 *
 * @property {boolean} [intro] -
 *
 * @property {boolean}  [$$inline] -
 */

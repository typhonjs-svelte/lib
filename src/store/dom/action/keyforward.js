/**
 * Provides an action to forward on key down & up events. This can be any object that has associated `keydown` and
 * `keyup` methods. See {@link KeyStore} for a store implementation.
 *
 * @param {HTMLElement} node - Target element.
 *
 * @param {import('..').KeyStore}   keyStore - KeyStore to forward events key down / up events to...
 *
 * @returns {{update: (function(import('..').KeyStore): void), destroy: Function}} Action lifecycle methods.
 */
export function keyforward(node, keyStore)
{
   if (typeof keyStore?.keydown !== 'function' || typeof keyStore.keyup !== 'function')
   {
      throw new TypeError(`'keyStore' doesn't have required 'keydown' or 'keyup' methods.`);
   }

   /**
    * @param {KeyboardEvent} event -
    */
   function onKeydown(event)
   {
      keyStore.keydown(event);
   }

   /**
    * @param {KeyboardEvent} event -
    */
   function onKeyup(event)
   {
      keyStore.keyup(event);
   }

   /**
    * Activates key listeners.
    */
   function activateListeners()
   {
      node.addEventListener('keydown', onKeydown);
      node.addEventListener('keyup', onKeyup);
   }

   /**
    * Removes key listeners.
    */
   function removeListeners()
   {
      node.removeEventListener('keydown', onKeydown);
      node.removeEventListener('keyup', onKeyup);
   }

   activateListeners();

   return {
      update: (newKeyStore) =>  // eslint-disable-line no-shadow
      {
         keyStore = newKeyStore;

         if (typeof keyStore?.keydown !== 'function' || typeof keyStore.keyup !== 'function')
         {
            throw new TypeError(`'newKeyStore' doesn't have required 'keydown' or 'keyup' methods.`);
         }
      },

      destroy: () => removeListeners()
   };
}

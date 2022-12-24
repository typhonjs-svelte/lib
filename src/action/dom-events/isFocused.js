import { isWritableStore } from '@typhonjs-svelte/lib/store';

/**
 * Provides an action to monitor focus state of a given element and set an associated store with current focus state.
 *
 * This action is usable with any writable store. 
 *
 * @param {HTMLElement} node - Target element.
 *
 * @param {import('svelte/store').Writable<boolean>}  storeFocused - Update store for focus changes.
 *
 * @returns {{update: update, destroy: (function(): void)}} Action lifecycle methods.
 */
export function isFocused(node, storeFocused)
{
   let localFocused = false;

   function setFocused(current)
   {
      localFocused = current;

      if (isWritableStore(storeFocused)) { storeFocused.set(localFocused); }
   }

   function onFocus()
   {
      setFocused(true);
   }

   function onBlur()
   {
      setFocused(false);
   }

   function activateListeners()
   {
      node.addEventListener('focus', onFocus);
      node.addEventListener('blur', onBlur);
   }

   function removeListeners()
   {
      node.removeEventListener('focus', onFocus);
      node.removeEventListener('blur', onBlur);
   }

   activateListeners();

   return {
      update: (newStoreFocused) =>  // eslint-disable-line no-shadow
      {
         storeFocused = newStoreFocused;
         setFocused(localFocused);
      },

      destroy: () => removeListeners()
   };
}

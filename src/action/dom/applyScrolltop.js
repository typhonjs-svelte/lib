import { Timing }          from '#runtime/util';
import { isWritableStore } from '#runtime/util/store';

import { resizeObserver }  from './resizeObserver.js';

/**
 * Provides an action to save `scrollTop` of an element with a vertical scrollbar. This action should be used on the
 * scrollable element and must include a writable store that holds the active store for the current `scrollTop` value.
 * You may switch the stores externally and this action will set the `scrollTop` based on the newly set store. This is
 * useful for instance providing a select box that controls the scrollable container.
 *
 * @param {HTMLElement} element - The target scrollable HTML element.
 *
 * @param {import('#svelte/store').Writable<number>}   store - A writable store that stores the element scrollTop.
 *
 * @returns {{
 *    update: (function(import('#svelte/store').Writable<number>): void),
 *    destroy: (function(): void)
 * }} Lifecycle functions.
 */
export function applyScrolltop(element, store)
{
   if (!isWritableStore(store))
   {
      throw new TypeError(`applyScrolltop error: 'store' must be a writable Svelte store.`);
   }

   /**
    * Updates element `scrollTop`.
    *
    * @param {number}   value -
    */
   function storeUpdate(value)
   {
      if (!Number.isFinite(value)) { return; }

      // For some reason for scrollTop to take on first update from a new element setTimeout is necessary.
      setTimeout(() => element.scrollTop = value, 0);
   }

   let unsubscribe = store.subscribe(storeUpdate);

   const resizeControl = resizeObserver(element, Timing.debounce(() =>
   {
      if (element.isConnected) { store.set(element.scrollTop); }
   }, 500));

   /**
    * Save target `scrollTop` to the current set store.
    *
    * @param {Event} event -
    */
   function onScroll(event)
   {
      store.set(event.target.scrollTop);
   }

   const debounceFn = Timing.debounce((e) => onScroll(e), 500);

   element.addEventListener('scroll', debounceFn);

   return {
      update: (newStore) =>
      {
         unsubscribe();
         store = newStore;

         if (!isWritableStore(store))
         {
            throw new TypeError(`applyScrolltop.update error: 'store' must be a writable Svelte store.`);
         }

         unsubscribe = store.subscribe(storeUpdate);
      },

      destroy: () =>
      {
         element.removeEventListener('scroll', debounceFn);
         unsubscribe();
         resizeControl.destroy();
      }
   };
}

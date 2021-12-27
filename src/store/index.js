export * from './LocalStorage.js';
export * from './SessionStorage.js';

export * from 'svelte-writable-derived';
export { default as writableDerived } from 'svelte-writable-derived';

/**
 * Subscribes to the given store with the update function provided and ignores the first automatic
 * update. All future updates are dispatched to the update function.
 *
 * @param {import('svelte/store').Readable | import('svelte/store').Writable} store -
 *  Store to subscribe to...
 *
 * @param {function} update - function to receive future updates.
 *
 * @returns {function} Store unsubscribe function.
 */
export function subscribeIgnoreFirst(store, update)
{
   let firedFirst = false;

   return store.subscribe((value) => {
      if (!firedFirst)
      {
         firedFirst = true;
      }
      else {
         update(value);
      }
   })
}

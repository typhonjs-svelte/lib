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

/**
 * Subscribes to the given store with two update functions provided. The first function is invoked on the initial
 * subscription. All future updates are dispatched to the update function.
 *
 * @param {import('svelte/store').Readable | import('svelte/store').Writable} store -
 *  Store to subscribe to...
 *
 * @param {function} first - Function to receive first update.
 *
 * @param {function} update - Function to receive future updates.
 *
 * @returns {function} Store unsubscribe function.
 */
export function subscribeFirstRest(store, first, update)
{
   let firedFirst = false;

   return store.subscribe((value) => {
      if (!firedFirst)
      {
         firedFirst = true;
         first(value);
      }
      else {
         update(value);
      }
   })
}

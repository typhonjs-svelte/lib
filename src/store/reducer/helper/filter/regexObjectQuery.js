import { get, writable }   from '#svelte/store';

import { Strings }         from '#runtime/util';
import { isIterable }      from '#runtime/util/object';
import { isWritableStore } from '#runtime/util/store';

/**
 * Creates a filter function to compare objects by a give property key against a regex test. The returned function
 * is also a writable Svelte store that builds a regex from the stores value.
 *
 * This filter function can be used w/ a dynamic reducer and bound as a store to input elements.
 *
 * @param {string|Iterable<string>}   properties - Property key to compare.
 *
 * @param {object}   [opts] - Optional parameters.
 *
 * @param {boolean}  [opts.caseSensitive=false] - When true regex test is case-sensitive.
 *
 * @param {import('#svelte/store').Writable<string>}  [opts.store=void] - Use the provided store to instead of creating
 *        a default writable store.
 *
 * @returns {((data: object) => boolean) & import('#svelte/store').Writable<string>} The query string filter.
 */
export function regexObjectQuery(properties, { caseSensitive = false, store } = {})
{
   let keyword = '';
   let regex;

   if (store !== void 0 && !isWritableStore(store))
   {
      throw new TypeError(`createObjectQuery error: 'store' is not a writable store.`);
   }

   const storeKeyword = store ? store : writable(keyword);

   // If an existing store is provided then set initial values.
   if (store)
   {
      const current = get(store);

      if (typeof current === 'string')
      {
         keyword = Strings.normalize(current);
         regex = new RegExp(RegExp.escape(keyword), caseSensitive ? '' : 'i');
      }
      else
      {
         store.set(keyword);
      }
   }

   /**
    * If there is no filter keyword / regex then do not filter otherwise filter based on the regex
    * created from the search input element.
    *
    * @param {object} data - Data object to test against regex.
    *
    * @returns {boolean} AnimationStore filter state.
    */
   function filterQuery(data)
   {
      if (keyword === '' || !regex) { return true; }

      if (isIterable(properties))
      {
         for (const property of properties)
         {
            if (regex.test(Strings.normalize(data?.[property]))) { return true; }
         }

         return false;
      }
      else
      {
         return regex.test(Strings.normalize(data?.[properties]));
      }
   }

   /**
    * Create a custom store that changes when the search keyword changes.
    *
    * @param {(string) => void} handler - A callback function that accepts strings.
    *
    * @returns {import('#svelte/store').Unsubscriber} Store unsubscribe function.
    */
   filterQuery.subscribe = (handler) =>
   {
      return storeKeyword.subscribe(handler);
   };

   /**
    * Set
    *
    * @param {string}   value - A new value for the keyword / regex test.
    */
   filterQuery.set = (value) =>
   {
      if (typeof value === 'string')
      {
         keyword = Strings.normalize(value);
         regex = new RegExp(RegExp.escape(keyword), caseSensitive ? '' : 'i');
         storeKeyword.set(keyword);
      }
   };

   return filterQuery;
}

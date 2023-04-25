import * as filters from './filter/index.js';

/**
 * Provides helper functions to create dynamic store driven filters and sort functions for dynamic reducers. The
 * returned functions are also Svelte stores and can be added to a reducer as well as used as a store.
 */
export class DynReducerHelper
{
   /**
    * Returns the following filter functions:
    * - regexObjectQuery(property, options); suitable for object reducers matching one or more properties against
    *   the store value as a regex. Optional parameters to set case sensitivity and passing in an existing store.
    *
    * @returns {{
    *    regexObjectQuery: (properties: string|Iterable<string>, options?: {caseSensitive?: boolean, store?: import('#svelte/store').Writable<string>}) => (((data: {}) => boolean) & import('#svelte/store').Writable<string>)
    * }}
    */
   static get filters() { return filters; }
}

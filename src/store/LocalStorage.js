import { writable }  from 'svelte-persistent-store/local';
import { get }       from 'svelte/store';

/**
 * @typedef {import('svelte/store').Writable & import('svelte/store').get_store_value} LSStore - The backing Svelte store; a writable w/ get method attached.
 */

export class LocalStorage
{
   /**
    * @type {Map<string, LSStore>}
    */
   #stores = new Map();

   /**
    * Get value from the localstorage.
    *
    * @param {string}   key - Key to lookup in localstorage.
    *
    * @param {*}        [defaultValue] - A default value to return if key not present in local storage.
    *
    * @returns {*} Value from local storage or if not defined any default value provided.
    */
   getItem(key, defaultValue)
   {
      let value = defaultValue;

      const storageValue = localStorage.getItem(key);

      if (storageValue !== void 0)
      {
         value = JSON.parse(storageValue);
      }

      return value;
   }

   /**
    * Returns the backing Svelte store for the given key; potentially sets a default value if the key
    * is not already set.
    *
    * @param {string}   key - Key to lookup in localstorage.
    *
    * @param {*}        [defaultValue] - A default value to return if key not present in local storage.
    *
    * @returns {LSStore} The Svelte store for this key.
    */
   getStore(key, defaultValue)
   {
      return s_GET_STORE(this.#stores, key, defaultValue);
   }

   /**
    * Sets the value for the given key in localstorage.
    *
    * @param {string}   key - Key to lookup in localstorage.
    *
    * @param {*}        value - A value to set for this key.
    */
   setItem(key, value)
   {
      const store = s_GET_STORE(this.#stores, key);
      store.set(value);
   }

   /**
    * Convenience method to swap a boolean value stored in local storage.
    *
    * @param {string}   key - Key to lookup in localstorage.
    *
    * @param {boolean}  [defaultValue] - A default value to return if key not present in local storage.
    *
    * @returns {boolean} The boolean swap for the given key.
    */
   swapItemBoolean(key, defaultValue)
   {
      const store = s_GET_STORE(this.#stores, key, defaultValue);
      const value = store.get();
      const newValue = typeof value === 'boolean' ? !value : false;

      store.set(newValue);
      return newValue;
   }
}

/**
 * Gets a store from the LSStore Map or creates a new store for the key and a given default value.
 *
 * @param {Map<string, LSStore>} stores - Map containing Svelte stores.
 *
 * @param {string}               key - Key to lookup in stores map.
 *
 * @param {boolean}              [defaultValue] - A default value to set for the store.
 *
 * @returns {LSStore} The store for the given key.
 */
function s_GET_STORE(stores, key, defaultValue = void 0)
{
   let store = stores.get(key);
   if (store === void 0)
   {
      store = s_CREATE_STORE(key, defaultValue);
      stores.set(key, store);
   }

   return store;
}

/**
 * Creates a new LSStore for the given key.
 *
 * @param {string}   key - Key to lookup in stores map.
 *
 * @param {boolean}  [defaultValue] - A default value to set for the store.
 *
 * @returns {LSStore} The new LSStore.
 */
function s_CREATE_STORE(key, defaultValue = void 0)
{
   try
   {
      if (localStorage.getItem(key))
      {
         defaultValue = JSON.parse(localStorage.getItem(key));
      }
   }
   catch (err) { /**/ }

   const store = writable(key, defaultValue);
   store.get = () => get(store);

   return store;
}

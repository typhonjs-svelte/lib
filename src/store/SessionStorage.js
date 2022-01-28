import { writable }  from 'svelte-persistent-store/session';
import { get }       from 'svelte/store';

/**
 * @typedef {import('svelte/store').Writable & import('svelte/store').get_store_value} SSStore - The backing Svelte store; a writable w/ get method attached.
 */

export class SessionStorage
{
   /**
    * @type {Map<string, SSStore>}
    */
   #stores = new Map();

   /**
    * Get value from the sessionstorage.
    *
    * @param {string}   key - Key to lookup in sessionstorage.
    *
    * @param {*}        [defaultValue] - A default value to return if key not present in session storage.
    *
    * @returns {*} Value from session storage or if not defined any default value provided.
    */
   getItem(key, defaultValue)
   {
      let value = defaultValue;

      const storageValue = sessionStorage.getItem(key);

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
    * @param {string}   key - Key to lookup in sessionstorage.
    *
    * @param {*}        [defaultValue] - A default value to return if key not present in session storage.
    *
    * @returns {LSStore} The Svelte store for this key.
    */
   getStore(key, defaultValue)
   {
      return s_GET_STORE(this.#stores, key, defaultValue);
   }

   /**
    * Sets the value for the given key in sessionstorage.
    *
    * @param {string}   key - Key to lookup in sessionstorage.
    *
    * @param {*}        value - A value to set for this key.
    */
   setItem(key, value)
   {
      const store = s_GET_STORE(this.#stores, key);
      store.set(value);
   }

   /**
    * Convenience method to swap a boolean value stored in session storage.
    *
    * @param {string}   key - Key to lookup in sessionstorage.
    *
    * @param {boolean}  [defaultValue] - A default value to return if key not present in session storage.
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
 * Gets a store from the SSStore Map or creates a new store for the key and a given default value.
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
 * Creates a new SSStore for the given key.
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
      if (sessionStorage.getItem(key))
      {
         defaultValue = JSON.parse(sessionStorage.getItem(key));
      }
   }
   catch (err) { /**/ }

   const store = writable(key, defaultValue);
   store.get = () => get(store);

   return store;
}

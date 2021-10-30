import { writable }  from 'svelte-persistent-store/local';
import { get }       from 'svelte/store';

export default class LocalStorage
{
   /**
    * @type {*}
    */
   #stores = new Map();

   getItem(itemId, defaultValue)
   {
      let value;

      const storageValue = localStorage.getItem(itemId);

      if (storageValue !== void 0)
      {
         value = JSON.parse(storageValue);
      }

      return value;
   }

   getStore(itemId, defaultValue)
   {
      return s_GET_STORE(this.#stores, itemId, defaultValue);
   }

   setItem(itemId, value)
   {
      const store = s_GET_STORE(this.#stores, itemId);
      store.set(value);
   }

   swapItemBoolean(itemId, defaultValue)
   {
      const store = s_GET_STORE(this.#stores, itemId, defaultValue);
      const value = store.get();
      const newValue = typeof value === 'boolean' ? !value : false;

      store.set(newValue);
      return newValue;
   }
}

function s_GET_STORE(stores, itemId, defaultValue = void 0)
{
   let store = stores.get(itemId);
   if (store === void 0)
   {
      store = s_CREATE_STORE(itemId, defaultValue);
      stores.set(itemId, store);
   }

   return store;
}

function s_CREATE_STORE(itemId, defaultValue = void 0)
{
   try
   {
      if (localStorage.getItem(itemId))
      {
         defaultValue = JSON.parse(localStorage.getItem(itemId));
      }
   }
   catch (err) { /**/ }

   const store = writable(itemId, defaultValue);
   store.get = () => get(store);

   return store;
}
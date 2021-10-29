import { writable }  from 'svelte-persistent-store/session';
import { get }       from 'svelte/store';

export default class SessionStorage
{
   /**
    * @type {*}
    */
   #stores = new Map();

   getItem(itemId, defaultValue)
   {
      // let value = defaultValue;
      //
      // try
      // {
      //    if (sessionStorage.getItem(itemId))
      //    {
      //       value = JSON.parse(sessionStorage.getItem(itemId));
      //    }
      // }
      // catch (err) { /**/ }
      //
      // return value;

      const store = s_GET_STORE(this.#stores, itemId, defaultValue);
      return store.get();
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
      if (sessionStorage.getItem(itemId))
      {
         defaultValue = JSON.parse(sessionStorage.getItem(itemId));
      }
   }
   catch (err) { /**/ }

   const store = writable(itemId, defaultValue);
   store.get = () => get(store);

   return store;
}
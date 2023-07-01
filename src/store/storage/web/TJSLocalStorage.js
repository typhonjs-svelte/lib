import { localStores }  from '#runtime/svelte/store/web-storage';

import { TJSWebStorage }  from './TJSWebStorage.js';

export class TJSLocalStorage extends TJSWebStorage
{
   constructor()
   {
      super({
         storage: globalThis?.localStorage,
         writable: localStores.writable,
         serialize: JSON.stringify,
         deserialize: JSON.parse
      });
   }
}

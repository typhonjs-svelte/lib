import { sessionStores }  from '#runtime/svelte/store/web-storage';

import { TJSWebStorage }  from './TJSWebStorage.js';

export class TJSSessionStorage extends TJSWebStorage
{
   constructor()
   {
      super({
         storage: globalThis?.sessionStorage,
         writable: sessionStores.writable,
         serialize: JSON.stringify,
         deserialize: JSON.parse
      });
   }
}

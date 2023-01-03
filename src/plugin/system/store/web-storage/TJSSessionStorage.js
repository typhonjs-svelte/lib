import { TJSSessionStorage as SS }  from '@typhonjs-svelte/lib/store';

export class TJSSessionStorage
{
   #storage = new SS();

   onPluginLoad(ev)
   {
      const prepend = typeof ev?.pluginOptions?.eventPrepend === 'string' ? `${ev.pluginOptions.eventPrepend}:` : '';

      ev.eventbus.on(`${prepend}storage:session:item:get`, this.#storage.getItem, this.#storage, { guard: true });
      ev.eventbus.on(`${prepend}storage:session:item:boolean:swap`, this.#storage.swapItemBoolean, this.#storage,
       { guard: true });
      ev.eventbus.on(`${prepend}storage:session:item:set`, this.#storage.setItem, this.#storage, { guard: true });
      ev.eventbus.on(`${prepend}storage:session:store:get`, this.#storage.getStore, this.#storage, { guard: true });
   }
}

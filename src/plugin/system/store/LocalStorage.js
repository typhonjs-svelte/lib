import { LocalStorage as LS } from '@typhonjs-svelte/lib/store';

const storage = new LS();

export class LocalStorage
{
   static onPluginLoad(ev)
   {
      const prepend = typeof ev?.pluginOptions?.eventPrepend === 'string' ? `${ev.pluginOptions.eventPrepend}:` : '';

      ev.eventbus.on(`${prepend}storage:local:item:get`, storage.getItem, storage, { guard: true });
      ev.eventbus.on(`${prepend}storage:local:item:boolean:swap`, storage.swapItemBoolean, storage, { guard: true });
      ev.eventbus.on(`${prepend}storage:local:item:set`, storage.setItem, storage, { guard: true });
      ev.eventbus.on(`${prepend}storage:local:store:get`, storage.getStore, storage, { guard: true });
   }
}

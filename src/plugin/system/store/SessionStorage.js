import { SessionStorage as SS }  from '@typhonjs-svelte/lib/store';

const storage = new SS();

export class SessionStorage
{
   static onPluginLoad(ev)
   {
      const prepend = typeof ev?.pluginOptions?.eventPrepend === 'string' ? `${ev.pluginOptions.eventPrepend}:` : '';

      ev.eventbus.on(`${prepend}storage:session:item:get`, storage.getItem, storage, { guard: true });
      ev.eventbus.on(`${prepend}storage:session:item:boolean:swap`, storage.swapItemBoolean, storage, { guard: true });
      ev.eventbus.on(`${prepend}storage:session:item:set`, storage.setItem, storage, { guard: true });
      ev.eventbus.on(`${prepend}storage:session:store:get`, storage.getStore, storage, { guard: true });
   }
}

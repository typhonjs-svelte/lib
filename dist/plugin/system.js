import { LocalStorage as LocalStorage$1, SessionStorage as SessionStorage$1 } from '@typhonjs-svelte/lib/store';

const storage$1 = new LocalStorage$1();

class LocalStorage
{
   static onPluginLoad(ev)
   {
      const prepend = typeof ev?.pluginOptions?.eventPrepend === 'string' ? `${ev.pluginOptions.eventPrepend}:` : '';

      ev.eventbus.on(`${prepend}storage:local:item:get`, storage$1.getItem, storage$1, { guard: true });
      ev.eventbus.on(`${prepend}storage:local:item:boolean:swap`, storage$1.swapItemBoolean, storage$1, { guard: true });
      ev.eventbus.on(`${prepend}storage:local:item:set`, storage$1.setItem, storage$1, { guard: true });
      ev.eventbus.on(`${prepend}storage:local:store:get`, storage$1.getStore, storage$1, { guard: true });
   }
}

const storage = new SessionStorage$1();

class SessionStorage
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

export { LocalStorage, SessionStorage };
//# sourceMappingURL=system.js.map

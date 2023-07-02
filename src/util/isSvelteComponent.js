/**
 * Provides basic duck typing to determine if the provided function is a constructor function for a Svelte component.
 *
 * @param {*}  comp - Data to check as a Svelte component.
 *
 * @returns {boolean} Whether basic duck typing succeeds.
 */
export function isSvelteComponent(comp)
{
   if (comp === null || comp === void 0 || typeof comp !== 'function') { return false; }

   // When using Vite in a developer build the SvelteComponent is wrapped in a ProxyComponent class.
   // This class doesn't define methods on the prototype, so we must check if the constructor name
   // starts with `Proxy<` as it provides the wrapped component as `Proxy<_wrapped component name_>`.
   const prototypeName = comp?.prototype?.constructor?.name;
   if (typeof prototypeName === 'string' && (prototypeName.startsWith('Proxy<') || prototypeName === 'ProxyComponent'))
   {
      return true;
   }

   return typeof window !== 'undefined' ?
    typeof comp.prototype.$destroy === 'function' && typeof comp.prototype.$on === 'function' : // client-side
     typeof comp.render === 'function'; // server-side
}

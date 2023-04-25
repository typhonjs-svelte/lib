import { check_outros, group_outros, transition_out } from '#svelte/internal';

/**
 * Runs outro transition then destroys Svelte component.
 *
 * Workaround for https://github.com/sveltejs/svelte/issues/4056
 *
 * @param {*}  instance - A Svelte component.
 */
export async function outroAndDestroy(instance)
{
   return new Promise((resolve) =>
   {
      if (instance.$$.fragment && instance.$$.fragment.o)
      {
         group_outros();
         transition_out(instance.$$.fragment, 0, 0, () =>
         {
            instance.$destroy();
            resolve();
         });
         check_outros();
      }
      else
      {
         instance.$destroy();
         resolve();
      }
   });
}

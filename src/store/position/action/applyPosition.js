import { hasSetter } from '#runtime/util/object';

/**
 * Provides an action to apply a TJSPosition instance to a HTMLElement and invoke `position.parent`
 *
 * @param {HTMLElement}       node - The node associated with the action.
 *
 * @param {import('..').TJSPosition}   position - A position instance.
 *
 * @returns {import('svelte/action').ActionReturn<import('..').TJSPosition>} The action lifecycle methods.
 */
export function applyPosition(node, position)
{
   if (hasSetter(position, 'parent')) { position.parent = node; }

   return {
      update: (newPosition) =>
      {
         // Sanity case to short circuit update if positions are the same instance.
         if (newPosition === position && newPosition.parent === position.parent) { return; }

         if (hasSetter(position, 'parent')) { position.parent = void 0; }

         position = newPosition;

         if (hasSetter(position, 'parent')) { position.parent = node; }
      },

      destroy: () => { if (hasSetter(position, 'parent')) { position.parent = void 0; } }
   };
}

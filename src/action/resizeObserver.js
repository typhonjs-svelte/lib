import { isWritableStore } from '@typhonjs-svelte/lib/store';

/**
 * Provides an action to monitor the given HTMLElement node with `ResizeObserver` posting width / height changes
 * to the target in various ways depending on the shape of the target. The target can be one of the following and the
 * precedence order is listed from top to bottom:
 *
 *
 * - has a `setDimension` function as attribute; width / height are passed as parameters.
 * - has `setWidth` & `setHeight` functions as attribute; width & height are passed as parameters.
 * - has
 * - target is an object; width and height attributes are directly set on target.
 * - target is a function; the function is invoked with width & height parameters.
 *
 * Note: Svelte currently uses an archaic IFrame based workaround to monitor offset / client width & height changes.
 * A more up to date way to do this is with ResizeObserver. To track when Svelte receives ResizeObserver support
 * monitor this issue: {@link https://github.com/sveltejs/svelte/issues/4233}
 *
 * Can-I-Use: {@link https://caniuse.com/resizeobserver}
 *
 * @param {HTMLElement}       node - The node associated with the action.
 *
 * @param {object | Function} target - An object to update with observed width & height changes.
 *
 * @returns {{update: Function, destroy: Function}} The action lifecycle methods.
 * @see {@link https://github.com/sveltejs/svelte/issues/4233}
 */
export function resizeObserver(node, target)
{
   let updateType = setUpdateType(target);

   const observer = new ResizeObserver((entries) =>
   {
      for (const entry of entries)
      {
         // An early out verifying that the entry matches the node.
         if (node !== entry?.target) { return; }

         switch (updateType)
         {
            case s_UPDATE_TYPES.attribute:
               target.width = entry.contentRect.width;
               target.height = entry.contentRect.height;
               break;

            case s_UPDATE_TYPES.function:
               target(entry.contentRect.width, entry.contentRect.height);
               break;

            case s_UPDATE_TYPES.setDimension:
               target.setDimension?.(entry.contentRect.width, entry.contentRect.height);
               break;

            case s_UPDATE_TYPES.setWidthAndHeight:
               target.setWidth?.(entry.contentRect.width);
               target.setHeight?.(entry.contentRect.height);
               break;

            case s_UPDATE_TYPES.storeObject:
               target.width.set(entry.contentRect.width);
               target.height.set(entry.contentRect.height);
               break;
         }
      }
   });

   observer.observe(node);

   return {
      update: (newTarget) =>
      {
         updateType = setUpdateType(newTarget);
         target = newTarget;
      },

      destroy: () =>
      {
         observer.unobserve(node);
         observer.disconnect();
      }
   };
}

/**
 * Defines the various shape / update type of the given target.
 *
 * @type {Record<string, number>}
 */
const s_UPDATE_TYPES = {
   none: 0,
   attribute: 1,
   function: 2,
   setDimension: 3,
   setWidthAndHeight: 4,
   storeObject: 5
};

/**
 * Determines the shape of the target instance regarding valid update mechanisms to set width & height changes.
 *
 * @param {*}  target - The target instance.
 *
 * @returns {number} Update type value.
 */
function setUpdateType(target)
{
   if (target?.setDimension instanceof Function) { return s_UPDATE_TYPES.setDimension; }

   if (target?.setWidth instanceof Function && target?.setHeight instanceof Function)
   {
      return s_UPDATE_TYPES.setWidthAndHeight;
   }

   const targetType = typeof target;

   // Does the target have width & height writable store attributes?
   if ((targetType === 'object' || targetType === 'function') && isWritableStore(target.width) &&
    isWritableStore(target.height))
   {
      return s_UPDATE_TYPES.storeObject;
   }

   if (targetType === 'object') { return s_UPDATE_TYPES.attribute; }

   if (targetType === 'function') { return s_UPDATE_TYPES.function; }

   return s_UPDATE_TYPES.none;
}

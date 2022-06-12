/**
 * Provides an action to always blur the element when any pointer up event occurs on the element.
 *
 * @param {HTMLElement}   node - The node to handle always blur on pointer up.
 */
export function alwaysBlur(node)
{
   function blur()
   {
      setTimeout(() => { if (document.activeElement === node) { node.blur(); } }, 0);
   }

   node.addEventListener('pointerup', blur);

   return {
      destroy: () => node.removeEventListener('pointerup', blur)
   };
}

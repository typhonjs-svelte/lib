/**
 * Provides an action to always blur the element when any pointer up event occurs on the element.
 *
 * @param {HTMLElement}   node - The node to handle always blur on pointer up.
 *
 * @returns {{destroy: Function}} Lifecycle functions.
 */
export function alwaysBlur(node)
{
   /**
    * Blurs node if active element.
    */
   function blurNode()
   {
      setTimeout(() => { if (document.activeElement === node) { node.blur(); } }, 0);
   }

   node.addEventListener('pointerup', blurNode);

   return {
      destroy: () => node.removeEventListener('pointerup', blurNode)
   };
}

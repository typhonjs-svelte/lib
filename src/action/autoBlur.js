/**
 * Provides an action to blur the element when any pointer down event occurs outside the element. This can be useful
 * for input elements including select to blur / unfocus the element when any pointer down occurs outside the element.
 *
 * @param {HTMLElement}   node - The node to handle automatic blur on focus loss.
 */
export function autoBlur(node)
{
   function blur() { document.body.removeEventListener('pointerdown', onPointerDown); }
   function focus() { document.body.addEventListener('pointerdown', onPointerDown) }

   /**
    * Blur the node if a pointer down event happens outside the node.
    * @param {PointerEvent} event
    */
   function onPointerDown(event)
   {
      if (event.target === node || node.contains(event.target)) { return; }

      if (document.activeElement === node) { node.blur(); }
   }

   node.addEventListener('blur', blur);
   node.addEventListener('focus', focus);

   return {
      destroy: () =>
      {
         document.body.removeEventListener('pointerdown', onPointerDown);
         node.removeEventListener('blur', blur);
         node.removeEventListener('focus', focus);
      }
   };
}

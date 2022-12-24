/**
 * Provides an action to blur the element when any pointer down event occurs outside the element. This can be useful
 * for input elements including select to blur / unfocus the element when any pointer down occurs outside the element.
 *
 * @param {HTMLElement}   node - The node to handle automatic blur on focus loss.
 *
 * @returns {{destroy: Function}} Lifecycle functions.
 */
export function autoBlur(node)
{
   /**
    * Removes listener on blur.
    */
   function onBlur() { document.body.removeEventListener('pointerdown', onPointerDown); }

   /**
    * Adds listener on focus.
    */
   function onFocus() { document.body.addEventListener('pointerdown', onPointerDown); }

   /**
    * Blur the node if a pointer down event happens outside the node.
    *
    * @param {PointerEvent} event -
    */
   function onPointerDown(event)
   {
      if (event.target === node || node.contains(event.target)) { return; }

      if (document.activeElement === node) { node.blur(); }
   }

   node.addEventListener('blur', onBlur);
   node.addEventListener('focus', onFocus);

   return {
      destroy: () =>
      {
         document.body.removeEventListener('pointerdown', onPointerDown);
         node.removeEventListener('blur', onBlur);
         node.removeEventListener('focus', onFocus);
      }
   };
}

/**
 * Provides an action to apply style properties provided as an object.
 *
 * @param {HTMLElement} node - Target element
 *
 * @param {Record<string, string>}  properties - Key / value object of properties to set.
 *
 * @returns {import('svelte/action').ActionReturn<Record<string, string>>} Lifecycle functions.
 */
export function applyStyles(node, properties)
{
   /** Sets properties on node. */
   function setProperties()
   {
      if (typeof properties !== 'object') { return; }

      for (const prop of Object.keys(properties))
      {
         node.style.setProperty(`${prop}`, properties[prop]);
      }
   }

   setProperties();

   return {
      /**
       * @param {Record<string, string>}  newProperties - Key / value object of properties to set.
       */
      update: (newProperties) =>
      {
         properties = newProperties;
         setProperties();
      }
   };
}

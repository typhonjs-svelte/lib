/**
 * Provides a toggle action for `details` HTML elements.
 *
 * @param {HTMLDetailsElement} details - The details element.
 *
 * @param {import('svelte/store').writable<boolean>} booleanStore - A boolean store.
 *
 * @returns {object} Destroy callback.
 */
export function toggleDetails(details, booleanStore)
{
   /** @type {HTMLElement} */
   const summary = details.querySelector('summary');

   /** @type {Animation} */
   let animation;

   let open = details.open;

   /**
    * @param {number} a -
    *
    * @param {number} b -
    *
    * @param {boolean} value -
    */
   function animate(a, b, value)
   {
      details.style.overflow = 'hidden';

      // Must guard when `b - a === 0`; add a small epsilon and wrap with Math.max.
      const duration = Math.max(0, 30 * Math.log(Math.abs(b - a) + Number.EPSILON));

      animation = details.animate(
       {
          height: [`${a}px`, `${b}px`]
       },
       {
          duration,
          easing: 'ease-out'
       }
      );

      booleanStore.set((open = value));

      animation.onfinish = () =>
      {
         details.open = value;
         details.style.overflow = '';
      };
   }

   /**
    * @param {MouseEvent} e - A mouse event.
    */
   function handleClick(e)
   {
      e.preventDefault();

      if (open)
      {
         const a = details.offsetHeight;
         const b = summary.offsetHeight;

         animate(a, b, false);
      }
      else
      {
         const a = details.offsetHeight;
         if (animation) { animation.cancel(); }
         details.open = true;
         const b = details.offsetHeight;

         animate(a, b, true);
      }
   }

   summary.addEventListener('click', handleClick);

   return {
      destroy()
      {
         summary.removeEventListener('click', handleClick);
      }
   };
}

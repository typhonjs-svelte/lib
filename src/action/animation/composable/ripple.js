import { debounce as debounceFn } from '@typhonjs-svelte/lib/util';

/**
 * Defines the classic Material Design ripple effect as an action. `ripple` is a wrapper around the returned action.
 * This allows it to be easily used as a prop.
 *
 * @param {object}   [opts] - Optional parameters.
 *
 * @param {number}   [opts.duration=600] - Duration in milliseconds.
 *
 * @param {string}   [opts.color='rgba(255, 255, 255, 0.7)'] - A valid CSS color.
 *
 * @param {string}   [opts.event='click'] - DOM event to bind element to respond with the ripple effect.
 *
 * @param {number}   [opts.debounce=undefined] - Add a debounce to incoming events in milliseconds.
 *
 * @returns Function - Actual action.
 */
export function ripple({ duration = 600, color = 'rgba(255, 255, 255, 0.7)', event = 'click', debounce } = {})
{
   return (element) =>
   {
      function createRipple(e) {
         const elementRect = element.getBoundingClientRect();

         const diameter = Math.max(elementRect.width, elementRect.height);
         const radius = diameter / 2;
         const left = `${e.clientX - (elementRect.left + radius)}px`;
         const top = `${e.clientY - (elementRect.top + radius)}px`;

         const span = document.createElement('span');

         span.style.width = `${diameter}px`;
         span.style.height = `${diameter}px`;
         span.style.left = left;
         span.style.top = top;
         span.style.position = 'absolute';
         span.style.borderRadius = '50%';
         span.style.backgroundColor = `var(--color-effect-ripple, ${color})`;

         element.append(span);

         const animation = span.animate([
            {  // from
               transform: 'scale(.7)',
               opacity: 0.5,
               filter: 'blur(2px)'
            },
            {  // to
               transform: 'scale(4)',
               opacity: 0,
               filter: 'blur(5px)'
            }
         ], duration);

         animation.onfinish = () => span.remove();
      }

      const eventFn = Number.isInteger(debounce) && debounce > 0 ? debounceFn(createRipple, debounce) : createRipple;

      element.addEventListener(event, eventFn);

      return {
         destroy: () => element.removeEventListener(event, eventFn)
      };
   }
}

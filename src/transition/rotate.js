import { linear } from 'svelte/easing';

import { lerp }   from '@typhonjs-svelte/lib/math';

/**
 * Provides a rotate transition. For options `easing` is applied to to the rotate transition. The default easing is
 * linear.
 *
 * Note: that when reversing the transition that time goes from `1 - 0`, so if specific options are applied for
 * rotating out transition then `end` and `initial` are swapped.
 *
 * @param {HTMLElement} node - The transition node.
 *
 * @param {object}      options - Optional parameters.
 *
 * @param {number}      [options.delay] - Delay in ms before start of transition.
 *
 * @param {number}      [options.duration] - Total transition length in ms.
 *
 * @param {Function}    [options.easing=linear] - The easing function to apply to the rotate transition.
 *
 * @param {number}      [options.end=0] - End rotation in degrees.
 *
 * @param {number}      [options.initial=0] - Initial rotation in degrees.
 *
 * @returns {{duration: number, css: (function(*=): string), delay: number, easing: (x: number) => number}}
 *  Transition object.
 */
export function rotate(node, options)
{
   const easingRotate = options.easing ?? linear;

   const initialDeg = options.initial ?? 0;
   const endDeg = options.end ?? 0;

   return {
      delay: options.delay ?? 0,
      duration: options.duration ?? 500,
      easing: linear,
      css: (t) =>
      {
         const rotateT = easingRotate(t);
         return `transform: rotate(${lerp(initialDeg, endDeg, rotateT)}deg)`;
      }
   };
}

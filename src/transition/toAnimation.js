/**
 * Converts a Svelte transition to an animation. Both transitions & animations use the same CSS / styles solution and
 * resulting data so wrap the transition function with the signature of an animation.
 *
 * @param {(node: Element, params?: object) => import('#svelte/transition').TransitionConfig} fn -
 *        A Svelte transition function.
 *
 * @returns {(node: Element, data: { from: DOMRect, to: DOMRect }, params?: object) => import('#svelte/transition').TransitionConfig} -
 *          Transition function converted to an animation.
 */
export function toAnimation(fn)
{
   return (node, animations, params = {}) => fn(node, params);
}

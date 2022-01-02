import * as svelte_store from 'svelte/store';

/**
 * Provides an action to apply style properties provided as an object.
 *
 * @param {HTMLElement} node - Target element
 *
 * @param {object}      properties - Key / value object of properties to set.
 *
 * @returns {Function} Update function.
 */
declare function applyStyles(node: HTMLElement, properties: object): Function;
/**
 * Provides a toggle action for `details` HTML elements. The boolean store provided controls animation.
 *
 * It is not necessary to bind the store to the `open` attribute of the associated details element.
 *
 * @param {HTMLDetailsElement} details - The details element.
 *
 * @param {import('svelte/store').Writable<boolean>} booleanStore - A boolean store.
 *
 * @returns {object} Destroy callback.
 */
declare function toggleDetails(details: HTMLDetailsElement, booleanStore: svelte_store.Writable<boolean>): object;

export { applyStyles, toggleDetails };

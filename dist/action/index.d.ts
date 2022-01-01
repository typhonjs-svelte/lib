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
 * Provides a toggle action for `details` HTML elements.
 *
 * @param {HTMLDetailsElement} details - The details element.
 *
 * @param {import('svelte/store').writable<boolean>} booleanStore - A boolean store.
 *
 * @returns {object} Destroy callback.
 */
declare function toggleDetails(details: HTMLDetailsElement, booleanStore: typeof svelte_store.writable): object;

export { applyStyles, toggleDetails };

/**
 * Wraps a callback in a debounced timeout.
 *
 * Delay execution of the callback function until the function has not been called for delay milliseconds
 *
 * @param {Function} callback - A function to execute once the debounced threshold has been passed.
 *
 * @param {number}   delay - An amount of time in milliseconds to delay.
 *
 * @return {Function} A wrapped function which can be called to debounce execution
 */
declare function debounce(callback: Function, delay: number): Function;
/**
 * Provides a method to determine if the passed in Svelte component has a getter & setter accessor.
 *
 * @param {*}        component - Svelte component.
 *
 * @param {string}   accessor - Accessor to test.
 *
 * @returns {boolean} Whether the component has the getter and setter for accessor.
 */
declare function hasAccessor(component: any, accessor: string): boolean;
/**
 * Provides a method to determine if the passed in Svelte component has a getter accessor.
 *
 * @param {*}        component - Svelte component.
 *
 * @param {string}   accessor - Accessor to test.
 *
 * @returns {boolean} Whether the component has the getter for accessor.
 */
declare function hasGetter(component: any, accessor: string): boolean;
/**
 * Provides a method to determine if the passed in Svelte component has a setter accessor.
 *
 * @param {*}        component - Svelte component.
 *
 * @param {string}   accessor - Accessor to test.
 *
 * @returns {boolean} Whether the component has the setter for accessor.
 */
declare function hasSetter(component: any, accessor: string): boolean;
/**
 * Provides a solid string hashing algorithm.
 *
 * Sourced from: https://stackoverflow.com/a/52171480
 *
 * @param {string}   str - String to hash.
 *
 * @param {number}   seed - A seed value altering the hash.
 *
 * @returns {number} Hash code.
 */
declare function hashCode(str: string, seed?: number): number;
/**
 * Provides basic duck typing to determine if the provided function is a constructor function for a Svelte component.
 *
 * @param {*}  comp - Data to check as a Svelte component.
 *
 * @returns {boolean} Whether basic duck typing succeeds.
 */
declare function isSvelteComponent(comp: any): boolean;
/**
 * Runs outro transition then destroys Svelte component.
 *
 * Workaround for https://github.com/sveltejs/svelte/issues/4056
 *
 * @param {*}  instance - A Svelte component.
 */
declare function outroAndDestroy(instance: any): Promise<any>;
/**
 * Parses a TyphonJS Svelte config object ensuring that classes specified are Svelte components and props are set
 * correctly.
 *
 * @param {object}   config - Svelte config object.
 *
 * @param {*}        [thisArg] - `This` reference to set for invoking any props function.
 *
 * @returns {object} The processed Svelte config object.
 */
declare function parseSvelteConfig(config: object, thisArg?: any): object;
/**
 * Generates a UUID v4 compliant ID. Please use a complete UUID generation package for guaranteed compliance.
 *
 * This code is an evolution of the following Gist.
 * https://gist.github.com/jed/982883
 *
 * There is a public domain / free copy license attached to it that is not a standard OSS license...
 * https://gist.github.com/jed/982883#file-license-txt
 *
 * @returns {string} UUIDv4
 */
declare function uuidv4(): string;

export { debounce, hasAccessor, hasGetter, hasSetter, hashCode, isSvelteComponent, outroAndDestroy, parseSvelteConfig, uuidv4 };

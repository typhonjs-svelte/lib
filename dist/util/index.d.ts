/**
 * Provides access to the Clipboard API for reading / writing text strings. This requires a secure context.
 *
 * Note: `writeText` will attempt to use the older `execCommand` if available when `navigator.clipboard` is not
 * available.
 */
declare class ClipboardAccess {
    /**
     * Uses `navigator.clipboard` if available to read text from the clipboard.
     *
     * Note: Always returns `undefined` when `navigator.clipboard` is not available or the clipboard contains the
     * empty string.
     *
     * @returns {Promise<string|undefined>} The current clipboard text or undefined.
     */
    static readText(): Promise<string | undefined>;
    /**
     * Uses `navigator.clipboard` if available then falls back to `document.execCommand('copy')` if available to copy
     * the given text to the clipboard.
     *
     * @param {string}   text - Text to copy to the browser clipboard.
     *
     * @returns {Promise<boolean>} Copy successful.
     */
    static writeText(text: string): Promise<boolean>;
}

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
declare namespace uuidv4 {
    /**
     * Validates that the given string is formatted as a UUIDv4 string.
     *
     * @param {string}   uuid - UUID string to test.
     *
     * @returns {boolean} Is UUIDv4 string.
     */
    function isValid(uuid: string): boolean;
}

/**
 * Normalizes a string.
 *
 * @param {string}   query - A string to normalize for comparisons.
 *
 * @returns {string} Cleaned string.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize
 */
declare function normalizeString(query: string): string;

/**
 * Recursive function that finds the closest parent stacking context.
 * See also https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context
 *
 * Original author: Kerry Liu / https://github.com/gwwar
 *
 * @see https://github.com/gwwar/z-context/blob/master/content-script.js
 * @see https://github.com/gwwar/z-context/blob/master/LICENSE
 *
 * @param {Element} node -
 *
 * @returns {StackingContext} The closest parent stacking context
 */
declare function getStackingContext(node: Element): StackingContext;
type StackingContext = {
    /**
     * - A DOM Element.
     */
    node: Element;
    /**
     * - Reason for why a stacking context was created.
     */
    reason: string;
};

/**
 * First pass at a system to create a unique style sheet for the UI library that loads default values for all CSS
 * variables.
 */
declare class StyleManager {
    /**
     *
     * @param {object}   opts - Options.
     *
     * @param {string}   opts.docKey - Required key providing a link to a specific style sheet element.
     *
     * @param {string}   [opts.selector=:root] - Selector element.
     *
     * @param {Document} [opts.document] - Target document to load styles into.
     *
     */
    constructor({ docKey, selector, document }?: {
        docKey: string;
        selector?: string;
        document?: Document;
    });
    /**
     * Provides an accessor to get the `cssText` for the style sheet.
     *
     * @returns {string}
     */
    get cssText(): string;
    /**
     * Provides a copy constructor to duplicate an existing StyleManager instance into a new document.
     *
     * Note: This is used to support the `PopOut` module.
     *
     * @param [document] Target browser document to clone into.
     *
     * @returns {StyleManager} New style manager instance.
     */
    clone(document?: Document): StyleManager;
    get(): {};
    /**
     * Gets a particular CSS variable.
     *
     * @param {string}   key - CSS variable property key.
     *
     * @returns {string} Returns CSS variable value.
     */
    getProperty(key: string): string;
    /**
     * Set rules by property / value; useful for CSS variables.
     *
     * @param {Object<string, string>}  rules - An object with property / value string pairs to load.
     *
     * @param {boolean}                 [overwrite=true] - When true overwrites any existing values.
     */
    setProperties(rules: {
        [x: string]: string;
    }, overwrite?: boolean): void;
    /**
     * Sets a particular property.
     *
     * @param {string}   key - CSS variable property key.
     *
     * @param {string}   value - CSS variable value.
     *
     * @param {boolean}  [overwrite=true] - Overwrite any existing value.
     */
    setProperty(key: string, value: string, overwrite?: boolean): void;
    /**
     * Removes the property keys specified. If `keys` is a string a single property is removed. Or if `keys` is an
     * iterable list then all property keys in the list are removed.
     *
     * @param {string|Iterable<string>} keys - The property keys to remove.
     */
    removeProperties(keys: string | Iterable<string>): void;
    /**
     * Removes a particular CSS variable.
     *
     * @param {string}   key - CSS variable property key.
     *
     * @returns {string} CSS variable value when removed.
     */
    removeProperty(key: string): string;
    #private;
}

/**
 * Parses a pixel string / computed styles. Ex. `100px` returns `100`.
 *
 * @param {string}   value - Value to parse.
 *
 * @returns {number|undefined} The integer component of a pixel string.
 */
declare function styleParsePixels(value: string): number | undefined;

/**
 * Provides a method to determine if the passed in object / Svelte component follows the application shell contract.
 * This involves ensuring that the accessors defined in `applicationShellContract`.
 *
 * Note: A caveat is that when using Vite in a developer build components are wrapped in a proxy / ProxyComponent that
 * defines instance accessors versus on the prototype, so the check below ensures that all accessors in the contract are
 * either available on the prototype or directly on the instance.
 *
 * @param {*}  component - Object / component to test.
 *
 * @returns {boolean} Whether the component is a ApplicationShell or TJSApplicationShell.
 */
declare function isApplicationShell(component: any): boolean;

/**
 * Provides basic duck typing to determine if the provided object is a HMR ProxyComponent instance or class.
 *
 * @param {*}  comp - Data to check as a HMR proxy component.
 *
 * @returns {boolean} Whether basic duck typing succeeds.
 */
declare function isHMRProxy(comp: any): boolean;

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
 * Wraps a callback in a debounced timeout.
 *
 * Delay execution of the callback function until the function has not been called for the given delay in milliseconds.
 *
 * @param {Function} callback - A function to execute once the debounced threshold has been passed.
 *
 * @param {number}   delay - An amount of time in milliseconds to delay.
 *
 * @returns {Function} A wrapped function that can be called to debounce execution.
 */
declare function debounce(callback: Function, delay: number): Function;

/**
 * Provides a method to determine if the passed in Svelte component has a getter accessor.
 *
 * @param {*}        object - An object.
 *
 * @param {string}   accessor - Accessor to test.
 *
 * @returns {boolean} Whether the component has the getter for accessor.
 */
declare function hasGetter(object: any, accessor: string): boolean;
/**
 * Provides a method to determine if the passed in Svelte component has a getter & setter accessor.
 *
 * @param {*}        object - An object.
 *
 * @param {string}   accessor - Accessor to test.
 *
 * @returns {boolean} Whether the component has the getter and setter for accessor.
 */
declare function hasAccessor(object: any, accessor: string): boolean;
/**
 * Provides a method to determine if the passed in Svelte component has a setter accessor.
 *
 * @param {*}        object - An object.
 *
 * @param {string}   accessor - Accessor to test.
 *
 * @returns {boolean} Whether the component has the setter for accessor.
 */
declare function hasSetter(object: any, accessor: string): boolean;

/**
 * Returns whether the target is or has the given prototype walking up the prototype chain.
 *
 * @param {*}  target - Any target to test.
 *
 * @param {Function} Prototype - Prototype function / class constructor to find.
 *
 * @returns {boolean} Target matches prototype.
 */
declare function hasPrototype(target: any, Prototype: Function): boolean;

interface StateMachineOptions {
    readonly allowedTags?: Set<string>;
    readonly disallowedTags?: Set<string>;
    readonly tagReplacementText: string;
    readonly encodePlaintextTagDelimiters: boolean;
}
declare function striptags(text: string, options?: Partial<StateMachineOptions>): string;

export { ClipboardAccess, StackingContext, StyleManager, debounce, getStackingContext, hasAccessor, hasGetter, hasPrototype, hasSetter, hashCode, isApplicationShell, isHMRProxy, isSvelteComponent, normalizeString, outroAndDestroy, parseSvelteConfig, striptags, styleParsePixels, uuidv4 };

import * as svelte_store from 'svelte/store';
import { noop } from 'svelte/types/runtime/internal/utils';
import { get } from 'svelte/types/runtime/store';

/**
 * - The backing Svelte store; a writable w/ get method attached.
 */
type LSStore = ((key: any, value: any, start?: typeof noop) => {
    set: (new_value: any) => void;
    update: (fn: any) => void;
    subscribe: (run: any, invalidate?: typeof noop) => svelte_store.Unsubscriber;
}) & typeof get;
/**
 * - The backing Svelte store; a writable w/ get method attached.
 */
type SSStore = ((key: any, value: any, start?: typeof noop) => {
    set: (new_value: any) => void;
    update: (fn: any) => void;
    subscribe: (run: any, invalidate?: typeof noop) => svelte_store.Unsubscriber;
}) & typeof get;
declare class LocalStorage {
    /**
     * Get value from the localstorage.
     *
     * @param {string}   key - Key to lookup in localstorage.
     *
     * @param {*}        [defaultValue] - A default value to return if key not present in local storage.
     *
     * @returns {*} Value from local storage or if not defined any default value provided.
     */
    getItem(key: string, defaultValue?: any): any;
    /**
     * Returns the backing Svelte store for the given key; potentially sets a default value if the key
     * is not already set.
     *
     * @param {string}   key - Key to lookup in localstorage.
     *
     * @param {*}        [defaultValue] - A default value to return if key not present in local storage.
     *
     * @returns {LSStore} The Svelte store for this key.
     */
    getStore(key: string, defaultValue?: any): LSStore;
    /**
     * Sets the value for the given key in localstorage.
     *
     * @param {string}   key - Key to lookup in localstorage.
     *
     * @param {*}        value - A value to set for this key.
     */
    setItem(key: string, value: any): void;
    /**
     * Convenience method to swap a boolean value stored in local storage.
     *
     * @param {string}   key - Key to lookup in localstorage.
     *
     * @param {boolean}  [defaultValue] - A default value to return if key not present in local storage.
     *
     * @returns {boolean} The boolean swap for the given key.
     */
    swapItemBoolean(key: string, defaultValue?: boolean): boolean;
}
declare class SessionStorage {
    /**
     * Get value from the sessionstorage.
     *
     * @param {string}   key - Key to lookup in sessionstorage.
     *
     * @param {*}        [defaultValue] - A default value to return if key not present in session storage.
     *
     * @returns {*} Value from session storage or if not defined any default value provided.
     */
    getItem(key: string, defaultValue?: any): any;
    /**
     * Returns the backing Svelte store for the given key; potentially sets a default value if the key
     * is not already set.
     *
     * @param {string}   key - Key to lookup in sessionstorage.
     *
     * @param {*}        [defaultValue] - A default value to return if key not present in session storage.
     *
     * @returns {LSStore} The Svelte store for this key.
     */
    getStore(key: string, defaultValue?: any): LSStore;
    /**
     * Sets the value for the given key in sessionstorage.
     *
     * @param {string}   key - Key to lookup in sessionstorage.
     *
     * @param {*}        value - A value to set for this key.
     */
    setItem(key: string, value: any): void;
    /**
     * Convenience method to swap a boolean value stored in session storage.
     *
     * @param {string}   key - Key to lookup in sessionstorage.
     *
     * @param {boolean}  [defaultValue] - A default value to return if key not present in session storage.
     *
     * @returns {boolean} The boolean swap for the given key.
     */
    swapItemBoolean(key: string, defaultValue?: boolean): boolean;
}
/**
 * Subscribes to the given store with the update function provided and ignores the first automatic
 * update. All future updates are dispatched to the update function.
 *
 * @param {import('svelte/store').Readable | import('svelte/store').Writable} store -
 *  Store to subscribe to...
 *
 * @param {function} update - function to receive future updates.
 *
 * @returns {function} Store unsubscribe function.
 */
declare function subscribeIgnoreFirst(store: svelte_store.Readable<any> | svelte_store.Writable<any>, update: Function): Function;

export { LSStore, LocalStorage, SSStore, SessionStorage, subscribeIgnoreFirst };

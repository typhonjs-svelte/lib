import * as _svelte_store from 'svelte/store';
import { Writable, Readable } from 'svelte/store';

declare class TJSLocalStorage {
    /**
     * Creates a new writable store for the given key.
     *
     * @param {string}   key - Key to lookup in stores map.
     *
     * @param {boolean}  [defaultValue] - A default value to set for the store.
     *
     * @returns {import('#svelte/store').Writable} The new store.
     */
    static "__#145988@#createStore"(key: string, defaultValue?: boolean): _svelte_store.Writable<any>;
    /**
     * Get value from the localStorage.
     *
     * @param {string}   key - Key to lookup in localStorage.
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
     * @param {string}   key - Key to lookup in localStorage.
     *
     * @param {*}        [defaultValue] - A default value to return if key not present in session storage.
     *
     * @returns {import('#svelte/store').Writable} The Svelte store for this key.
     */
    getStore(key: string, defaultValue?: any): _svelte_store.Writable<any>;
    /**
     * Sets the value for the given key in localStorage.
     *
     * @param {string}   key - Key to lookup in localStorage.
     *
     * @param {*}        value - A value to set for this key.
     */
    setItem(key: string, value: any): void;
    /**
     * Convenience method to swap a boolean value stored in session storage.
     *
     * @param {string}   key - Key to lookup in localStorage.
     *
     * @param {boolean}  [defaultValue] - A default value to return if key not present in session storage.
     *
     * @returns {boolean} The boolean swap for the given key.
     */
    swapItemBoolean(key: string, defaultValue?: boolean): boolean;
    #private;
}

declare class TJSSessionStorage {
    /**
     * Creates a new store for the given key.
     *
     * @param {string}   key - Key to lookup in stores map.
     *
     * @param {boolean}  [defaultValue] - A default value to set for the store.
     *
     * @returns {import('#svelte/store').Writable} The new store.
     */
    static "__#145989@#createStore"(key: string, defaultValue?: boolean): _svelte_store.Writable<any>;
    /**
     * Get value from the sessionStorage.
     *
     * @param {string}   key - Key to lookup in sessionStorage.
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
     * @param {string}   key - Key to lookup in sessionStorage.
     *
     * @param {*}        [defaultValue] - A default value to return if key not present in session storage.
     *
     * @returns {import('#svelte/store').Writable} The Svelte store for this key.
     */
    getStore(key: string, defaultValue?: any): _svelte_store.Writable<any>;
    /**
     * Sets the value for the given key in sessionStorage.
     *
     * @param {string}   key - Key to lookup in sessionStorage.
     *
     * @param {*}        value - A value to set for this key.
     */
    setItem(key: string, value: any): void;
    /**
     * Convenience method to swap a boolean value stored in session storage.
     *
     * @param {string}   key - Key to lookup in sessionStorage.
     *
     * @param {boolean}  [defaultValue] - A default value to return if key not present in session storage.
     *
     * @returns {boolean} The boolean swap for the given key.
     */
    swapItemBoolean(key: string, defaultValue?: boolean): boolean;
    #private;
}

/**
 * Provides a basic test for a given variable to test if it has the shape of a readable store by having a `subscribe`
 * function.
 *
 * Note: functions are also objects, so test that the variable might be a function w/ a `subscribe` function.
 *
 * @param {*}  store - variable to test that might be a store.
 *
 * @returns {boolean} Whether the variable tested has the shape of a store.
 */
declare function isReadableStore(store: any): boolean;
/**
 * Provides a basic test for a given variable to test if it has the shape of a writable store by having a `subscribe`
 * function and an `update` function.
 *
 * Note: functions are also objects, so test that the variable might be a function w/ a `subscribe` function.
 *
 * @param {*}  store - variable to test that might be a store.
 *
 * @returns {boolean} Whether the variable tested has the shape of a store.
 */
declare function isUpdatableStore(store: any): boolean;
/**
 * Provides a basic test for a given variable to test if it has the shape of a writable store by having a `subscribe`
 * `set`, and `update` functions.
 *
 * Note: functions are also objects, so test that the variable might be a function w/ `subscribe` & `set` functions.
 *
 * @param {*}  store - variable to test that might be a store.
 *
 * @returns {boolean} Whether the variable tested has the shape of a store.
 */
declare function isWritableStore(store: any): boolean;
/**
 * Wraps a writable stores set method invoking a callback after the store is set. This allows hard coupled parent /
 * child relationships between stores to update directly without having to subscribe to the child store. This is a
 * particular powerful pattern when the `setCallback` is a debounced function that syncs a parent store and / or
 * serializes data.
 *
 * Note: Do consider carefully if this is an optimum solution; this is a quick implementation helper, but a better
 * solution is properly managing store relationships through subscription.
 *
 * @template T
 *
 * @param {import('#svelte/store').Writable<T>} store - A store to wrap.
 *
 * @param {(store?: import('#svelte/store').Writable<T>, value?: T) => void} setCallback - A callback to invoke after
 *        store set.
 *
 * @returns {import('#svelte/store').Writable<T>} Wrapped store.
 */
declare function storeCallback<T>(store: _svelte_store.Writable<T>, setCallback: (store?: _svelte_store.Writable<T>, value?: T) => void): _svelte_store.Writable<T>;
/**
 * Subscribes to the given store with the update function provided and ignores the first automatic
 * update. All future updates are dispatched to the update function.
 *
 * @param {import('#svelte/store').Readable | import('#svelte/store').Writable} store -
 *  Store to subscribe to...
 *
 * @param {import('#svelte/store').Updater} update - function to receive future updates.
 *
 * @returns {import('#svelte/store').Unsubscriber} Store unsubscribe function.
 */
declare function subscribeIgnoreFirst(store: _svelte_store.Readable<any> | _svelte_store.Writable<any>, update: any): _svelte_store.Unsubscriber;
/**
 * Subscribes to the given store with two update functions provided. The first function is invoked on the initial
 * subscription. All future updates are dispatched to the update function.
 *
 * @param {import('#svelte/store').Readable | import('#svelte/store').Writable} store -
 *  Store to subscribe to...
 *
 * @param {import('#svelte/store').Updater} first - Function to receive first update.
 *
 * @param {import('#svelte/store').Updater} update - Function to receive future updates.
 *
 * @returns {import('#svelte/store').Unsubscriber} Store unsubscribe function.
 */
declare function subscribeFirstRest(store: _svelte_store.Readable<any> | _svelte_store.Writable<any>, first: any, update: any): _svelte_store.Unsubscriber;

/** The minimal requirements of the
 * [writable store contract](https://svelte.dev/docs#component-format-script-4-prefix-stores-with-$-to-access-their-values-store-contract).
 */
type MinimalWritable<T> = Pick<Writable<T>, "set" | "subscribe">;

/** Stores that may be used as origins. */
type Stores = MinimalWritable<any> | [Readable<any>, ...Array<Readable<any>>] | Array<Readable<any>>;

/** Values retrieved from origin stores. */
type StoresValues<T> = T extends Readable<infer U> ? U :
    { [K in keyof T]: T[K] extends Readable<infer U> ? U : never };

/** Values sent to origin stores. */
type SetValues<T> = T extends MinimalWritable<infer U> ? U :
    { [K in keyof T]?: T[K] extends MinimalWritable<infer U> ? U : never };

/**
 * Create a store similar to [Svelte's `derived`](https://svelte.dev/docs#run-time-svelte-store-writable), but which
 * has its own `set` and `update` methods and can send values back to the origin stores.
 * [Read more...](https://github.com/PixievoltNo1/svelte-writable-derived#default-export-writablederived)
 *
 * @param origins One or more stores to derive from. Same as
 * [`derived`](https://svelte.dev/docs#run-time-svelte-store-writable)'s 1st parameter.
 * @param derive The callback to determine the derived value. Same as
 * [`derived`](https://svelte.dev/docs#run-time-svelte-store-writable)'s 2nd parameter.
 * @param reflect Called when the
 * derived store gets a new value via its `set` or `update` methods, and determines new values for
 * the origin stores. [Read more...](https://github.com/PixievoltNo1/svelte-writable-derived#new-parameter-reflect)
 * @param [initial] The new store's initial value. Same as
 * [`derived`](https://svelte.dev/docs#run-time-svelte-store-writable)'s 3rd parameter.
 *
 * @returns A writable store.
 */
declare function writableDerived<S extends Stores, T>(
    origins: S,
    derive: (values: StoresValues<S>) => T,
    reflect: (reflecting: T, old: StoresValues<S>) => SetValues<S>,
    initial?: T
): Writable<T>;

declare function writableDerived<S extends Stores, T>(
    origins: S,
    derive: (values: StoresValues<S>, set: (value: T) => void) => void,
    reflect: (reflecting: T, old: StoresValues<S>) => SetValues<S>,
    initial?: T
): Writable<T>;


/**
 * Create a store for a property value in an object contained in another store.
 * [Read more...](https://github.com/PixievoltNo1/svelte-writable-derived#named-export-propertystore)
 *
 * @param origin The store containing the object to get/set from.
 * @param propName The property to get/set, or a path of
 * properties in nested objects.
 *
 * @returns A writable store.
 */
declare function propertyStore<O extends object, K extends keyof O>(
    origin: MinimalWritable<O>,
    propName: K | [K]
): Writable<O[K]>;

declare function propertyStore<O extends object, K1 extends keyof O, K2 extends keyof O[K1]>(
    origin: MinimalWritable<O>,
    propName: [K1, K2]
): Writable<O[K1][K2]>;

declare function propertyStore<
    O extends object,
    K1 extends keyof O,
    K2 extends keyof O[K1],
    K3 extends keyof O[K1][K2]
>(
    origin: MinimalWritable<O>,
    propName: [K1, K2, K3]
): Writable<O[K1][K2][K3]>;

declare function propertyStore<
    O extends object,
    K1 extends keyof O,
    K2 extends keyof O[K1],
    K3 extends keyof O[K1][K2],
    K4 extends keyof O[K1][K2][K3]
>(
    origin: MinimalWritable<O>,
    propName: [K1, K2, K3, K4]
): Writable<O[K1][K2][K3][K4]>;

declare function propertyStore(
    origin: MinimalWritable<object>,
    propName: string | number | symbol | Array<string | number | symbol>
): Writable<any>;

export { TJSLocalStorage, TJSSessionStorage, isReadableStore, isUpdatableStore, isWritableStore, propertyStore, storeCallback, subscribeFirstRest, subscribeIgnoreFirst, writableDerived };

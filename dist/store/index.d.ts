import * as svelte_store from 'svelte/store';

/**
 * - The backing Svelte store; a writable w/ get method attached.
 */
type LSStore = svelte_store.Writable<any>;
/**
 * - The backing Svelte store; a writable w/ get method attached.
 */
type SSStore = svelte_store.Writable<any>;
/**
 * Provides a managed array with non-destructive reducing / filtering / sorting capabilities with subscription /
 * Svelte store support.
 *
 * @template T
 */
declare class DynArrayReducer<T> {
    /**
     * Provides a utility method to determine if the given data is iterable / implements iterator protocol.
     *
     * @param {*}  data - Data to verify as iterable.
     *
     * @returns {boolean} Is data iterable.
     */
    static "__#196559@#isIterable"(data: any): boolean;
    /**
     * Initializes DynArrayReducer. Any iterable is supported for initial data. Take note that if `data` is an array it
     * will be used as the host array and not copied. All non-array iterables otherwise create a new array / copy.
     *
     * @param {Iterable<T>|DynData<T>}   [data=[]] - Data iterable to store if array or copy otherwise.
     */
    constructor(data?: Iterable<T> | any);
    /**
     * Returns the internal data of this instance. Be careful!
     *
     * Note: if an array is set as initial data then that array is used as the internal data. If any changes are
     * performed to the data externally do invoke {@link index.update} with `true` to recalculate the index and notify
     * all subscribers.
     *
     * @returns {T[]} The internal data.
     */
    get data(): T[];
    /**
     * @returns {AdapterFilters<T>} The filters adapter.
     */
    get filters(): AdapterFilters<T>;
    /**
     * Returns the Indexer public API.
     *
     * @returns {IndexerAPI & Iterable<number>} Indexer API - is also iterable.
     */
    get index(): any;
    /**
     * Gets the main data / items length.
     *
     * @returns {number} Main data / items length.
     */
    get length(): number;
    /**
     * Sets reversed state and notifies subscribers.
     *
     * @param {boolean} reversed - New reversed state.
     */
    set reversed(arg: boolean);
    /**
     * Gets current reversed state.
     *
     * @returns {boolean} Reversed state.
     */
    get reversed(): boolean;
    /**
     * @returns {AdapterSort<T>} The sort adapter.
     */
    get sort(): AdapterSort<T>;
    /**
     * Removes internal data and pushes new data. This does not destroy any initial array set to internal data unless
     * `replace` is set to true.
     *
     * @param {T[] | Iterable<T>} data - New data to set to internal data.
     *
     * @param {boolean} [replace=false] - New data to set to internal data.
     */
    setData(data: T[] | Iterable<T>, replace?: boolean): void;
    /**
     *
     * @param {function(DynArrayReducer<T>): void} handler - Callback function that is invoked on update / changes.
     *                                                       Receives `this` reference.
     *
     * @returns {(function(): void)} Unsubscribe function.
     */
    subscribe(handler: (arg0: DynArrayReducer<T>) => void): (() => void);
    /**
     * Provides an iterator for data stored in DynArrayReducer.
     *
     * @returns {Generator<*, T, *>} Generator / iterator of all data.
     * @yields {T}
     */
    [Symbol.iterator](): Generator<any, T, any>;
    #private;
}
/**
 * @typedef {import('svelte/store').Writable} LSStore - The backing Svelte store; a writable w/ get method attached.
 */
declare class LocalStorage {
    /**
     * Creates a new LSStore for the given key.
     *
     * @param {string}   key - Key to lookup in stores map.
     *
     * @param {boolean}  [defaultValue] - A default value to set for the store.
     *
     * @returns {LSStore} The new LSStore.
     */
    static "__#196560@#createStore"(key: string, defaultValue?: boolean): svelte_store.Writable<any>;
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
     * @returns {LSStore} The Svelte store for this key.
     */
    getStore(key: string, defaultValue?: any): svelte_store.Writable<any>;
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
/**
 * @typedef {import('svelte/store').Writable} SSStore - The backing Svelte store; a writable w/ get method attached.
 */
declare class SessionStorage {
    /**
     * Creates a new SSStore for the given key.
     *
     * @param {string}   key - Key to lookup in stores map.
     *
     * @param {boolean}  [defaultValue] - A default value to set for the store.
     *
     * @returns {LSStore} The new LSStore.
     */
    static "__#196561@#createStore"(key: string, defaultValue?: boolean): svelte_store.Writable<any>;
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
     * @returns {LSStore} The Svelte store for this key.
     */
    getStore(key: string, defaultValue?: any): svelte_store.Writable<any>;
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
 * Create a store for a property value in an object contained in another store.
 * [Read more...](https://github.com/PixievoltNo1/svelte-writable-derived#named-export-propertystore)
 *
 * @param {Store} origin The store containing the object to get/set from.
 * @param {string|number|symbol|Array<string|number|symbol>} propName The property to get/set, or a path of
 * properties in nested objects.
 *
 * @returns {Store} A writable store.
 */
declare function propertyStore(origin: any, propName: string | number | symbol | Array<string | number | symbol>): any;
/**
 * Subscribes to the given store with two update functions provided. The first function is invoked on the initial
 * subscription. All future updates are dispatched to the update function.
 *
 * @param {import('svelte/store').Readable | import('svelte/store').Writable} store -
 *  Store to subscribe to...
 *
 * @param {import('svelte/store').Updater} first - Function to receive first update.
 *
 * @param {import('svelte/store').Updater} update - Function to receive future updates.
 *
 * @returns {import('svelte/store').Unsubscriber} Store unsubscribe function.
 */
declare function subscribeFirstRest(store: svelte_store.Readable<any> | svelte_store.Writable<any>, first: any, update: any): svelte_store.Unsubscriber;
/**
 * Subscribes to the given store with the update function provided and ignores the first automatic
 * update. All future updates are dispatched to the update function.
 *
 * @param {import('svelte/store').Readable | import('svelte/store').Writable} store -
 *  Store to subscribe to...
 *
 * @param {import('svelte/store').Updater} update - function to receive future updates.
 *
 * @returns {import('svelte/store').Unsubscriber} Store unsubscribe function.
 */
declare function subscribeIgnoreFirst(store: svelte_store.Readable<any> | svelte_store.Writable<any>, update: any): svelte_store.Unsubscriber;
/**
 * @external Store
 * @see [Svelte stores](https://svelte.dev/docs#component-format-script-4-prefix-stores-with-$-to-access-their-values-store-contract)
 */
/**
 * Create a store similar to [Svelte's `derived`](https://svelte.dev/docs#run-time-svelte-store-writable),
 * but which has its own `set` and `update` methods and can send values back to the origin stores.
 * [Read more...](https://github.com/PixievoltNo1/svelte-writable-derived#default-export-writablederived)
 *
 * @param {Store|Store[]} origins One or more stores to derive from. Same as
 * [`derived`](https://svelte.dev/docs#run-time-svelte-store-writable)'s 1st parameter.
 * @param {!Function} derive The callback to determine the derived value. Same as
 * [`derived`](https://svelte.dev/docs#run-time-svelte-store-writable)'s 2nd parameter.
 * @param {!Function|{withOld: !Function}} reflect Called when the
 * derived store gets a new value via its `set` or `update` methods, and determines new values for
 * the origin stores. [Read more...](https://github.com/PixievoltNo1/svelte-writable-derived#new-parameter-reflect)
 * @param [initial] The new store's initial value. Same as
 * [`derived`](https://svelte.dev/docs#run-time-svelte-store-writable)'s 3rd parameter.
 *
 * @returns {Store} A writable store.
 */
declare function writableDerived(origins: any | any[], derive: Function, reflect: Function | {
    withOld: Function;
}, initial?: any): any;
/**
 * Provides the storage and sequencing of managed filters. Each filter added may be a bespoke function or a
 * {@link FilterData} object containing an `id`, `filter`, and `weight` attributes; `filter` is the only required
 * attribute.
 *
 * The `id` attribute can be anything that creates a unique ID for the filter; recommended strings or numbers. This
 * allows filters to be removed by ID easily.
 *
 * The `weight` attribute is a number between 0 and 1 inclusive that allows filters to be added in a
 * predictable order which is especially handy if they are manipulated at runtime. A lower weighted filter always runs
 * before a higher weighted filter. For speed and efficiency always set the heavier / more inclusive filter with a
 * lower weight; an example of this is a keyword / name that will filter out many entries making any further filtering
 * faster. If no weight is specified the default of '1' is assigned and it is appended to the end of the filters list.
 *
 * This class forms the public API which is accessible from the `.filters` getter in the main DynArrayReducer instance.
 * ```
 * const dynArray = new DynArrayReducer([...]);
 * dynArray.filters.add(...);
 * dynArray.filters.clear();
 * dynArray.filters.length;
 * dynArray.filters.remove(...);
 * dynArray.filters.removeBy(...);
 * dynArray.filters.removeById(...);
 * ```
 *
 * @template T
 */
declare class AdapterFilters<T> {
    /**
     * @param {Function} indexUpdate - update function for the indexer.
     *
     * @returns {[AdapterFilters<T>, {filters: FilterData<T>[]}]} Returns this and internal storage for filter adapters.
     */
    constructor(indexUpdate: Function);
    /**
     * @returns {number} Returns the length of the
     */
    get length(): number;
    /**
     * @param {...(FilterFn<T>|FilterData<T>)}   filters -
     */
    add(...filters: (any | any)[]): void;
    clear(): void;
    /**
     * @param {...(FilterFn<T>|FilterData<T>)}   filters -
     */
    remove(...filters: (any | any)[]): void;
    /**
     * Remove filters by the provided callback. The callback takes 3 parameters: `id`, `filter`, and `weight`.
     * Any truthy value returned will remove that filter.
     *
     * @param {function(*, FilterFn<T>, number): boolean} callback - Callback function to evaluate each filter entry.
     */
    removeBy(callback: (arg0: any, arg1: any, arg2: number) => boolean): void;
    removeById(...ids: any[]): void;
    /**
     * Provides an iterator for filters.
     *
     * @returns {Generator<number|undefined, FilterData<T>, *>} Generator / iterator of filters.
     * @yields {FilterData<T>}
     */
    [Symbol.iterator](): Generator<number | undefined, any, any>;
    #private;
}
/**
 * @template T
 */
declare class AdapterSort<T> {
    /**
     * @param {Function} indexUpdate - Function to update indexer.
     *
     * @returns {[AdapterSort<T>, {compareFn: CompareFn<T>}]} This and the internal sort adapter data.
     */
    constructor(indexUpdate: Function);
    /**
     * @param {CompareFn<T>|SortData<T>}  data -
     *
     * A callback function that compares two values. Return > 0 to sort b before a;
     * < 0 to sort a before b; or 0 to keep original order of a & b.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#parameters
     */
    set(data: any | any): void;
    reset(): void;
    #private;
}

export { DynArrayReducer, LSStore, LocalStorage, SSStore, SessionStorage, isReadableStore, isUpdatableStore, isWritableStore, propertyStore, subscribeFirstRest, subscribeIgnoreFirst, writableDerived };

import { writable as writable$2, get, derived } from 'svelte/store';
import { noop, run_all, is_function } from 'svelte/internal';

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
class AdapterFilters
{
   #filtersAdapter;
   #indexUpdate;
   #mapUnsubscribe = new Map();

   /**
    * @param {Function} indexUpdate - update function for the indexer.
    *
    * @returns {[AdapterFilters<T>, {filters: FilterData<T>[]}]} Returns this and internal storage for filter adapters.
    */
   constructor(indexUpdate)
   {
      this.#indexUpdate = indexUpdate;

      this.#filtersAdapter = { filters: [] };

      Object.seal(this);

      return [this, this.#filtersAdapter];
   }

   /**
    * @returns {number} Returns the length of the
    */
   get length() { return this.#filtersAdapter.filters.length; }

   /**
    * Provides an iterator for filters.
    *
    * @returns {Generator<number|undefined, FilterData<T>, *>} Generator / iterator of filters.
    * @yields {FilterData<T>}
    */
   *[Symbol.iterator]()
   {
      if (this.#filtersAdapter.filters.length === 0) { return; }

      for (const entry of this.#filtersAdapter.filters)
      {
         yield { ...entry };
      }
   }

   /**
    * @param {...(FilterFn<T>|FilterData<T>)}   filters -
    */
   add(...filters)
   {
      /**
       * Tracks the number of filters added that have subscriber functionality.
       *
       * @type {number}
       */
      let subscribeCount = 0;

      for (const filter of filters)
      {
         const filterType = typeof filter;

         if (filterType !== 'function' && filterType !== 'object' || filter === null)
         {
            throw new TypeError(`DynArrayReducer error: 'filter' is not a function or object.`);
         }

         let data = void 0;
         let subscribeFn = void 0;

         switch (filterType)
         {
            case 'function':
               data = {
                  id: void 0,
                  filter,
                  weight: 1
               };

               subscribeFn = filter.subscribe;
               break;

            case 'object':
               if (typeof filter.filter !== 'function')
               {
                  throw new TypeError(`DynArrayReducer error: 'filter' attribute is not a function.`);
               }

               if (filter.weight !== void 0 && typeof filter.weight !== 'number' ||
                (filter.weight < 0 || filter.weight > 1))
               {
                  throw new TypeError(
                   `DynArrayReducer error: 'weight' attribute is not a number between '0 - 1' inclusive.`);
               }

               data = {
                  id: filter.id !== void 0 ? filter.id : void 0,
                  filter: filter.filter,
                  weight: filter.weight || 1
               };

               subscribeFn = filter.filter.subscribe ?? filter.subscribe;
               break;
         }

         // Find the index to insert where data.weight is less than existing values weight.
         const index = this.#filtersAdapter.filters.findIndex((value) =>
         {
            return data.weight < value.weight;
         });

         // If an index was found insert at that location.
         if (index >= 0)
         {
            this.#filtersAdapter.filters.splice(index, 0, data);
         }
         else // push to end of filters.
         {
            this.#filtersAdapter.filters.push(data);
         }

         if (typeof subscribeFn === 'function')
         {
            const unsubscribe = subscribeFn(this.#indexUpdate);

            // Ensure that unsubscribe is a function.
            if (typeof unsubscribe !== 'function')
            {
               throw new TypeError(
                'DynArrayReducer error: Filter has subscribe function, but no unsubscribe function is returned.');
            }

            // Ensure that the same filter is not subscribed to multiple times.
            if (this.#mapUnsubscribe.has(data.filter))
            {
               throw new Error(
                'DynArrayReducer error: Filter added already has an unsubscribe function registered.');
            }

            this.#mapUnsubscribe.set(data.filter, unsubscribe);
            subscribeCount++;
         }
      }

      // Filters with subscriber functionality are assumed to immediately invoke the `subscribe` callback. If the
      // subscriber count is less than the amount of filters added then automatically trigger an index update manually.
      if (subscribeCount < filters.length) { this.#indexUpdate(); }
   }

   clear()
   {
      this.#filtersAdapter.filters.length = 0;

      // Unsubscribe from all filters with subscription support.
      for (const unsubscribe of this.#mapUnsubscribe.values())
      {
         unsubscribe();
      }

      this.#mapUnsubscribe.clear();

      this.#indexUpdate();
   }

   /**
    * @param {...(FilterFn<T>|FilterData<T>)}   filters -
    */
   remove(...filters)
   {
      const length = this.#filtersAdapter.filters.length;

      if (length === 0) { return; }

      for (const data of filters)
      {
         // Handle the case that the filter may either be a function or a filter entry / object.
         const actualFilter = typeof data === 'function' ? data : data !== null && typeof data === 'object' ?
          data.filter : void 0;

         if (!actualFilter) { continue; }

         for (let cntr = this.#filtersAdapter.filters.length; --cntr >= 0;)
         {
            if (this.#filtersAdapter.filters[cntr].filter === actualFilter)
            {
               this.#filtersAdapter.filters.splice(cntr, 1);

               // Invoke any unsubscribe function for given filter then remove from tracking.
               let unsubscribe = void 0;
               if (typeof (unsubscribe = this.#mapUnsubscribe.get(actualFilter)) === 'function')
               {
                  unsubscribe();
                  this.#mapUnsubscribe.delete(actualFilter);
               }
            }
         }
      }

      // Update the index a filter was removed.
      if (length !== this.#filtersAdapter.filters.length) { this.#indexUpdate(); }
   }

   /**
    * Remove filters by the provided callback. The callback takes 3 parameters: `id`, `filter`, and `weight`.
    * Any truthy value returned will remove that filter.
    *
    * @param {function(*, FilterFn<T>, number): boolean} callback - Callback function to evaluate each filter entry.
    */
   removeBy(callback)
   {
      const length = this.#filtersAdapter.filters.length;

      if (length === 0) { return; }

      if (typeof callback !== 'function')
      {
         throw new TypeError(`DynArrayReducer error: 'callback' is not a function.`);
      }

      this.#filtersAdapter.filters = this.#filtersAdapter.filters.filter((data) =>
      {
         const remove = callback.call(callback, { ...data });

         if (remove)
         {
            let unsubscribe;
            if (typeof (unsubscribe = this.#mapUnsubscribe.get(data.filter)) === 'function')
            {
               unsubscribe();
               this.#mapUnsubscribe.delete(data.filter);
            }
         }

         // Reverse remove boolean to properly filter / remove this filter.
         return !remove;
      });

      if (length !== this.#filtersAdapter.filters.length) { this.#indexUpdate(); }
   }

   removeById(...ids)
   {
      const length = this.#filtersAdapter.filters.length;

      if (length === 0) { return; }

      this.#filtersAdapter.filters = this.#filtersAdapter.filters.filter((data) =>
      {
         let remove = false;

         for (const id of ids) { remove |= data.id === id; }

         // If not keeping invoke any unsubscribe function for given filter then remove from tracking.
         if (remove)
         {
            let unsubscribe;
            if (typeof (unsubscribe = this.#mapUnsubscribe.get(data.filter)) === 'function')
            {
               unsubscribe();
               this.#mapUnsubscribe.delete(data.filter);
            }
         }

         return !remove; // Swap here to actually remove the item via array filter method.
      });

      if (length !== this.#filtersAdapter.filters.length) { this.#indexUpdate(); }
   }
}

/**
 * @template T
 */
class AdapterSort
{
   #sortAdapter;
   #indexUpdate;
   #unsubscribe;

   /**
    * @param {Function} indexUpdate - Function to update indexer.
    *
    * @returns {[AdapterSort<T>, {compareFn: CompareFn<T>}]} This and the internal sort adapter data.
    */
   constructor(indexUpdate)
   {
      this.#indexUpdate = indexUpdate;

      this.#sortAdapter = { compareFn: null };

      Object.seal(this);

      return [this, this.#sortAdapter];
   }

   /**
    * @param {CompareFn<T>|SortData<T>}  data -
    *
    * A callback function that compares two values. Return > 0 to sort b before a;
    * < 0 to sort a before b; or 0 to keep original order of a & b.
    *
    * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#parameters
    */
   set(data)
   {
      if (typeof this.#unsubscribe === 'function')
      {
         this.#unsubscribe();
         this.#unsubscribe = void 0;
      }

      let compareFn = void 0;
      let subscribeFn = void 0;

      switch (typeof data)
      {
         case 'function':
            compareFn = data;
            subscribeFn = data.subscribe;
            break;

         case 'object':
            // Early out if data is null / noop.
            if (data === null) { break; }

            if (typeof data.compare !== 'function')
            {
               throw new TypeError(`DynArrayReducer error: 'compare' attribute is not a function.`);
            }

            compareFn = data.compare;
            subscribeFn = data.compare.subscribe ?? data.subscribe;
            break;
      }

      if (typeof compareFn === 'function')
      {
         this.#sortAdapter.compareFn = compareFn;
      }
      else
      {
         const oldCompareFn = this.#sortAdapter.compareFn;
         this.#sortAdapter.compareFn = null;

         // Update index if the old compare function exists.
         if (typeof oldCompareFn === 'function') { this.#indexUpdate(); }
         return;
      }

      if (typeof subscribeFn === 'function')
      {
         this.#unsubscribe = subscribeFn(this.#indexUpdate);

         // Ensure that unsubscribe is a function.
         if (typeof this.#unsubscribe !== 'function')
         {
            throw new Error(
             `DynArrayReducer error: sort has 'subscribe' function, but no 'unsubscribe' function is returned.`);
         }
      }
      else
      {
         // A sort function with subscriber functionality are assumed to immediately invoke the `subscribe` callback.
         // Only manually update the index if there is no subscriber functionality.
         this.#indexUpdate();
      }
   }

   reset()
   {
      const oldCompareFn = this.#sortAdapter.compareFn;

      this.#sortAdapter.compareFn = null;

      if (typeof this.#unsubscribe === 'function')
      {
         this.#unsubscribe();
         this.#unsubscribe = void 0;
      }

      // Only update index if an old compare function is set.
      if (typeof oldCompareFn === 'function') { this.#indexUpdate(); }
   }
}

class Indexer
{
   constructor(hostItems, hostUpdate)
   {
      this.hostItems = hostItems;
      this.hostUpdate = hostUpdate;

      const indexAdapter = { index: null, hash: null };

      const publicAPI = {
         update: this.update.bind(this),

         /**
          * Provides an iterator over the index array.
          *
          * @returns {Generator<any, void, *>} Iterator.
          * @yields
          */
         [Symbol.iterator]: function *()
         {
            if (!indexAdapter.index) { return; }

            for (const index of indexAdapter.index) { yield index; }
         }
      };

      // Define a getter on the public API to get the length / count of index array.
      Object.defineProperties(publicAPI, {
         hash: { get: () => indexAdapter.hash },
         isActive: { get: () => this.isActive() },
         length: { get: () => Array.isArray(indexAdapter.index) ? indexAdapter.index.length : 0 }
      });

      Object.freeze(publicAPI);

      indexAdapter.publicAPI = publicAPI;

      this.indexAdapter = indexAdapter;

      return [this, indexAdapter];
   }

   /**
    * Calculates a new hash value for the new index array if any. If the new index array is null then the hash value
    * is set to null. Set calculated new hash value to the index adapter hash value.
    *
    * After hash generation compare old and new hash values and perform an update if they are different. If they are
    * equal check for array equality between the old and new index array and perform an update if they are not equal.
    *
    * @param {number[]}    oldIndex - Old index array.
    *
    * @param {number|null} oldHash - Old index hash value.
    */
   calcHashUpdate(oldIndex, oldHash)
   {
      let newHash = null;
      const newIndex = this.indexAdapter.index;

      if (newIndex)
      {
         for (let cntr = newIndex.length; --cntr >= 0;)
         {
            newHash ^= newIndex[cntr] + 0x9e3779b9 + (newHash << 6) + (newHash >> 2);
         }
      }

      this.indexAdapter.hash = newHash;

      if (oldHash === newHash ? !s_ARRAY_EQUALS(oldIndex, newIndex) : true) { this.hostUpdate(); }
   }

   initAdapters(filtersAdapter, sortAdapter)
   {
      this.filtersAdapter = filtersAdapter;
      this.sortAdapter = sortAdapter;

      this.sortFn = (a, b) =>
      {
         return this.sortAdapter.compareFn(this.hostItems[a], this.hostItems[b]);
      };
   }

   isActive()
   {
      return this.filtersAdapter.filters.length > 0 || this.sortAdapter.compareFn !== null;
   }

   /**
    * Provides the custom filter / reduce step that is ~25-40% faster than implementing with `Array.reduce`.
    *
    * Note: Other loop unrolling techniques like Duff's Device gave a slight faster lower bound on large data sets,
    * but the maintenance factor is not worth the extra complication.
    *
    * @returns {number[]} New filtered index array.
    */
   reduceImpl()
   {
      const data = [];

      const filters = this.filtersAdapter.filters;

      let include = true;

      for (let cntr = 0, length = this.hostItems.length; cntr < length; cntr++)
      {
         include = true;

         for (let filCntr = 0, filLength = filters.length; filCntr < filLength; filCntr++)
         {
            if (!filters[filCntr].filter(this.hostItems[cntr]))
            {
               include = false;
               break;
            }
         }

         if (include) { data.push(cntr); }
      }

      return data;
   }

   update()
   {
      const oldIndex = this.indexAdapter.index;
      const oldHash = this.indexAdapter.hash;

      // Clear index if there are no filters and no sort function or the index length doesn't match the item length.
      if ((this.filtersAdapter.filters.length === 0 && !this.sortAdapter.compareFn) ||
       (this.indexAdapter.index && this.hostItems.length !== this.indexAdapter.index.length))
      {
         this.indexAdapter.index = null;
      }

      // If there are filters build new index.
      if (this.filtersAdapter.filters.length > 0) { this.indexAdapter.index = this.reduceImpl(); }

      if (this.sortAdapter.compareFn)
      {
         // If there is no index then create one with keys matching host item length.
         if (!this.indexAdapter.index) { this.indexAdapter.index = [...Array(this.hostItems.length).keys()]; }

         this.indexAdapter.index.sort(this.sortFn);
      }

      this.calcHashUpdate(oldIndex, oldHash);
   }
}

/**
 * Checks for array equality between two arrays of numbers.
 *
 * @param {number[]} a - Array A
 *
 * @param {number[]} b - Array B
 *
 * @returns {boolean} Arrays equal
 */
function s_ARRAY_EQUALS(a, b)
{
   if (a === b) { return true; }
   if (a === null || b === null) { return false; }

   /* c8 ignore next */
   if (a.length !== b.length) { return false; }

   for (let cntr = a.length; --cntr >= 0;)
   {
      /* c8 ignore next */
      if (a[cntr] !== b[cntr]) { return false; }
   }

   return true;
}

/**
 * Provides a managed array with non-destructive reducing / filtering / sorting capabilities with subscription /
 * Svelte store support.
 *
 * @template T
 */
class DynArrayReducer
{
   #items;

   #index;
   #indexAdapter;

   /**
    * @type {AdapterFilters<T>}
    */
   #filters;

   /**
    * @type {{filters: FilterFn<T>[]}}
    */
   #filtersAdapter;

   /**
    * @type {AdapterSort<T>}
    */
   #sort;

   /**
    * @type {{compareFn: CompareFn<T>}}
    */
   #sortAdapter;

   #subscriptions = [];

   /**
    * Initializes DynArrayReducer. Any iterable is supported for initial data. Take note that if `data` is an array it
    * will be used as the host array and not copied. All non-array iterables otherwise create a new array / copy.
    *
    * @param {Iterable<T>|DynData<T>}   data - Data iterable to store if array or copy otherwise.
    */
   constructor(data = void 0)
   {
      let dataIterable = void 0;
      let filters = void 0;
      let sort = void 0;

      // Potentially working with DynData.
      if (!s_IS_ITERABLE(data) && typeof data === 'object')
      {
         if (!s_IS_ITERABLE(data.data))
         {
            throw new TypeError(`DynArrayReducer error (DynData): 'data' attribute is not iterable.`);
         }

         dataIterable = data.data;

         if (data.filters !== void 0)
         {
            if (s_IS_ITERABLE(data.filters))
            {
               filters = data.filters;
            }
            else
            {
               throw new TypeError(`DynArrayReducer error (DynData): 'filters' attribute is not iterable.`);
            }
         }

         if (data.sort !== void 0)
         {
            if (typeof data.sort === 'function')
            {
               sort = data.sort;
            }
            else
            {
               throw new TypeError(`DynArrayReducer error (DynData): 'sort' attribute is not a function.`);
            }
         }
      }
      else
      {
         if (!s_IS_ITERABLE(data)) { throw new TypeError(`DynArrayReducer error: 'data' is not iterable.`); }

         dataIterable = data;
      }

      // In the case of the main data being an array directly use the array otherwise create a copy.
      this.#items = Array.isArray(dataIterable) ? dataIterable : [...dataIterable];

      [this.#index, this.#indexAdapter] = new Indexer(this.#items, this.#notify.bind(this));

      [this.#filters, this.#filtersAdapter] = new AdapterFilters(this.#indexAdapter.publicAPI.update);
      [this.#sort, this.#sortAdapter] = new AdapterSort(this.#indexAdapter.publicAPI.update);

      this.#index.initAdapters(this.#filtersAdapter, this.#sortAdapter);

      // Add any filters and sort function defined by DynData.
      if (filters) { this.filters.add(...filters); }
      if (sort) { this.sort.set(sort); }
   }

   /**
    * @returns {AdapterFilters<T>} The filters adapter.
    */
   get filters() { return this.#filters; }

   /**
    * Returns the Indexer public API.
    *
    * @returns {IndexerAPI & Iterable<number>} Indexer API - is also iterable.
    */
   get index() { return this.#indexAdapter.publicAPI; }

   /**
    * Gets the main data / items length.
    *
    * @returns {number} Main data / items length.
    */
   get length() { return this.#items.length; }

   /**
    * @returns {AdapterSort<T>} The sort adapter.
    */
   get sort() { return this.#sort; }

   /**
    *
    * @param {function(DynArrayReducer<T>): void} handler - Callback function that is invoked on update / changes.
    *                                                       Receives `this` reference.
    *
    * @returns {(function(): void)} Unsubscribe function.
    */
   subscribe(handler)
   {
      this.#subscriptions.push(handler); // add handler to the array of subscribers

      handler(this);                     // call handler with current value

      // Return unsubscribe function.
      return () =>
      {
         const index = this.#subscriptions.findIndex((sub) => sub === handler);
         if (index >= 0) { this.#subscriptions.splice(index, 1); }
      };
   }

   /**
    *
    */
   #notify()
   {
      // Subscriptions are stored locally as on the browser Babel is still used for private class fields / Babel
      // support until 2023. IE not doing this will require several extra method calls otherwise.
      const subscriptions = this.#subscriptions;
      for (let cntr = 0; cntr < subscriptions.length; cntr++) { subscriptions[cntr](this); }
   }

   /**
    * Provides an iterator for data stored in DynArrayReducer.
    *
    * @returns {Generator<*, T, *>} Generator / iterator of all data.
    * @yields {T}
    */
   *[Symbol.iterator]()
   {
      const items = this.#items;

      if (items.length === 0) { return; }

      if (this.#index.isActive())
      {
         for (const entry of this.index) { yield items[entry]; }
      }
      else
      {
         for (const entry of items) { yield entry; }
      }
   }
}

/**
 * Provides a utility method to determine if the given data is iterable / implements iterator protocol.
 *
 * @param {*}  data - Data to verify as iterable.
 *
 * @returns {boolean} Is data iterable.
 */
function s_IS_ITERABLE(data)
{
   return data !== null && data !== void 0 && typeof data === 'object' && typeof data[Symbol.iterator] === 'function';
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
function isReadableStore(store)
{
   if (store === null || store === void 0) { return false; }

   switch (typeof store)
   {
      case 'function':
      case 'object':
         return typeof store.subscribe === 'function';
   }

   return false;
}

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
function isUpdatableStore(store)
{
   if (store === null || store === void 0) { return false; }

   switch (typeof store)
   {
      case 'function':
      case 'object':
         return typeof store.subscribe === 'function' && typeof store.update === 'function';
   }

   return false;
}

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
function isWritableStore(store)
{
   if (store === null || store === void 0) { return false; }

   switch (typeof store)
   {
      case 'function':
      case 'object':
         return typeof store.subscribe === 'function' && typeof store.set === 'function';
   }

   return false;
}

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
function subscribeIgnoreFirst(store, update)
{
   let firedFirst = false;

   return store.subscribe((value) => {
      if (!firedFirst)
      {
         firedFirst = true;
      }
      else {
         update(value);
      }
   })
}

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
function subscribeFirstRest(store, first, update)
{
   let firedFirst = false;

   return store.subscribe((value) => {
      if (!firedFirst)
      {
         firedFirst = true;
         first(value);
      }
      else {
         update(value);
      }
   })
}

// src/generator.ts
function isSimpleDeriver(deriver) {
  return deriver.length < 2;
}
function generator(storage) {
  function readable(key, value, start) {
    return {
      subscribe: writable(key, value, start).subscribe
    };
  }
  function writable(key, value, start = noop) {
    function wrap_start(ogSet) {
      return start(function wrap_set(new_value) {
        if (storage) {
          storage.setItem(key, JSON.stringify(new_value));
        }
        return ogSet(new_value);
      });
    }
    if (storage) {
      const storageValue = storage.getItem(key);
      try {
        if (storageValue) {
          value = JSON.parse(storageValue);
        }
      } catch (err) {
      }
      storage.setItem(key, JSON.stringify(value));
    }
    const ogStore = writable$2(value, start ? wrap_start : void 0);
    function set(new_value) {
      if (storage) {
        storage.setItem(key, JSON.stringify(new_value));
      }
      ogStore.set(new_value);
    }
    function update(fn) {
      set(fn(get(ogStore)));
    }
    function subscribe(run, invalidate = noop) {
      return ogStore.subscribe(run, invalidate);
    }
    return {set, update, subscribe};
  }
  function derived(key, stores, fn, initial_value) {
    const single = !Array.isArray(stores);
    const stores_array = single ? [stores] : stores;
    if (storage && storage.getItem(key)) {
      try {
        initial_value = JSON.parse(storage.getItem(key));
      } catch (err) {
      }
    }
    return readable(key, initial_value, (set) => {
      let inited = false;
      const values = [];
      let pending = 0;
      let cleanup = noop;
      const sync = () => {
        if (pending) {
          return;
        }
        cleanup();
        const input = single ? values[0] : values;
        if (isSimpleDeriver(fn)) {
          set(fn(input));
        } else {
          const result = fn(input, set);
          cleanup = is_function(result) ? result : noop;
        }
      };
      const unsubscribers = stores_array.map((store, i) => store.subscribe((value) => {
        values[i] = value;
        pending &= ~(1 << i);
        if (inited) {
          sync();
        }
      }, () => {
        pending |= 1 << i;
      }));
      inited = true;
      sync();
      return function stop() {
        run_all(unsubscribers);
        cleanup();
      };
    });
  }
  return {
    readable,
    writable,
    derived,
    get: get
  };
}

// src/local.ts
var storage$1 = typeof window !== "undefined" ? window.localStorage : void 0;
var g$1 = generator(storage$1);
var writable$1 = g$1.writable;

/**
 * @typedef {import('svelte/store').Writable & import('svelte/store').get} LSStore - The backing Svelte store; a writable w/ get method attached.
 */

class LocalStorage
{
   /**
    * @type {Map<string, LSStore>}
    */
   #stores = new Map();

   /**
    * Get value from the localstorage.
    *
    * @param {string}   key - Key to lookup in localstorage.
    *
    * @param {*}        [defaultValue] - A default value to return if key not present in local storage.
    *
    * @returns {*} Value from local storage or if not defined any default value provided.
    */
   getItem(key, defaultValue)
   {
      let value = defaultValue;

      const storageValue = localStorage.getItem(key);

      if (storageValue !== void 0)
      {
         value = JSON.parse(storageValue);
      }

      return value;
   }

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
   getStore(key, defaultValue)
   {
      return s_GET_STORE$1(this.#stores, key, defaultValue);
   }

   /**
    * Sets the value for the given key in localstorage.
    *
    * @param {string}   key - Key to lookup in localstorage.
    *
    * @param {*}        value - A value to set for this key.
    */
   setItem(key, value)
   {
      const store = s_GET_STORE$1(this.#stores, key);
      store.set(value);
   }

   /**
    * Convenience method to swap a boolean value stored in local storage.
    *
    * @param {string}   key - Key to lookup in localstorage.
    *
    * @param {boolean}  [defaultValue] - A default value to return if key not present in local storage.
    *
    * @returns {boolean} The boolean swap for the given key.
    */
   swapItemBoolean(key, defaultValue)
   {
      const store = s_GET_STORE$1(this.#stores, key, defaultValue);
      const value = store.get();
      const newValue = typeof value === 'boolean' ? !value : false;

      store.set(newValue);
      return newValue;
   }
}

/**
 * Gets a store from the LSStore Map or creates a new store for the key and a given default value.
 *
 * @param {Map<string, LSStore>} stores - Map containing Svelte stores.
 *
 * @param {string}               key - Key to lookup in stores map.
 *
 * @param {boolean}              [defaultValue] - A default value to set for the store.
 *
 * @returns {LSStore} The store for the given key.
 */
function s_GET_STORE$1(stores, key, defaultValue = void 0)
{
   let store = stores.get(key);
   if (store === void 0)
   {
      store = s_CREATE_STORE$1(key, defaultValue);
      stores.set(key, store);
   }

   return store;
}

/**
 * Creates a new LSStore for the given key.
 *
 * @param {string}   key - Key to lookup in stores map.
 *
 * @param {boolean}  [defaultValue] - A default value to set for the store.
 *
 * @returns {LSStore} The new LSStore.
 */
function s_CREATE_STORE$1(key, defaultValue = void 0)
{
   try
   {
      const value = localStorage.getItem(key);
      if (value) { defaultValue = JSON.parse(value); }
   }
   catch (err) { /**/ }

   const store = writable$1(key, defaultValue);


   store.get = () => get(store);

   return store;
}

// src/session.ts
var storage = typeof window !== "undefined" ? window.sessionStorage : void 0;
var g = generator(storage);
var writable = g.writable;

/**
 * @typedef {import('svelte/store').Writable & import('svelte/store').get} SSStore - The backing Svelte store; a writable w/ get method attached.
 */

class SessionStorage
{
   /**
    * @type {Map<string, SSStore>}
    */
   #stores = new Map();

   /**
    * Get value from the sessionstorage.
    *
    * @param {string}   key - Key to lookup in sessionstorage.
    *
    * @param {*}        [defaultValue] - A default value to return if key not present in session storage.
    *
    * @returns {*} Value from session storage or if not defined any default value provided.
    */
   getItem(key, defaultValue)
   {
      let value = defaultValue;

      const storageValue = sessionStorage.getItem(key);

      if (storageValue !== void 0)
      {
         value = JSON.parse(storageValue);
      }

      return value;
   }

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
   getStore(key, defaultValue)
   {
      return s_GET_STORE(this.#stores, key, defaultValue);
   }

   /**
    * Sets the value for the given key in sessionstorage.
    *
    * @param {string}   key - Key to lookup in sessionstorage.
    *
    * @param {*}        value - A value to set for this key.
    */
   setItem(key, value)
   {
      const store = s_GET_STORE(this.#stores, key);
      store.set(value);
   }

   /**
    * Convenience method to swap a boolean value stored in session storage.
    *
    * @param {string}   key - Key to lookup in sessionstorage.
    *
    * @param {boolean}  [defaultValue] - A default value to return if key not present in session storage.
    *
    * @returns {boolean} The boolean swap for the given key.
    */
   swapItemBoolean(key, defaultValue)
   {
      const store = s_GET_STORE(this.#stores, key, defaultValue);
      const value = store.get();
      const newValue = typeof value === 'boolean' ? !value : false;

      store.set(newValue);
      return newValue;
   }
}

/**
 * Gets a store from the SSStore Map or creates a new store for the key and a given default value.
 *
 * @param {Map<string, LSStore>} stores - Map containing Svelte stores.
 *
 * @param {string}               key - Key to lookup in stores map.
 *
 * @param {boolean}              [defaultValue] - A default value to set for the store.
 *
 * @returns {LSStore} The store for the given key.
 */
function s_GET_STORE(stores, key, defaultValue = void 0)
{
   let store = stores.get(key);
   if (store === void 0)
   {
      store = s_CREATE_STORE(key, defaultValue);
      stores.set(key, store);
   }

   return store;
}

/**
 * Creates a new SSStore for the given key.
 *
 * @param {string}   key - Key to lookup in stores map.
 *
 * @param {boolean}  [defaultValue] - A default value to set for the store.
 *
 * @returns {LSStore} The new LSStore.
 */
function s_CREATE_STORE(key, defaultValue = void 0)
{
   try
   {
      const value = sessionStorage.getItem(key);
      if (value) { defaultValue = JSON.parse(value); }
   }
   catch (err) { /**/ }

   const store = writable(key, defaultValue);
   store.get = () => get(store);

   return store;
}

/**
 * @external Store
 * @see [Svelte stores](https://svelte.dev/docs#Store_contract)
 */

/**
 * Create a store similar to [Svelte's `derived`](https://svelte.dev/docs#derived), but which
 * has its own `set` and `update` methods and can send values back to the origin stores.
 * [Read more...](https://github.com/PixievoltNo1/svelte-writable-derived#default-export-writablederived)
 * 
 * @param {Store|Store[]} origins One or more stores to derive from. Same as
 * [`derived`](https://svelte.dev/docs#derived)'s 1st parameter.
 * @param {!Function} derive The callback to determine the derived value. Same as
 * [`derived`](https://svelte.dev/docs#derived)'s 2nd parameter.
 * @param {!Function|{withOld: !Function}} reflect Called when the
 * derived store gets a new value via its `set` or `update` methods, and determines new values for
 * the origin stores. [Read more...](https://github.com/PixievoltNo1/svelte-writable-derived#new-parameter-reflect)
 * @param [initial] The new store's initial value. Same as
 * [`derived`](https://svelte.dev/docs#derived)'s 3rd parameter.
 * 
 * @returns {Store} A writable store.
 */
function writableDerived(origins, derive, reflect, initial) {
	var childDerivedSetter, originValues, allowDerive = true;
	var reflectOldValues = "withOld" in reflect;
	var wrappedDerive = (got, set) => {
		childDerivedSetter = set;
		if (reflectOldValues) {
			originValues = got;
		}
		if (allowDerive) {
			let returned = derive(got, set);
			if (derive.length < 2) {
				set(returned);
			} else {
				return returned;
			}
		}
	};
	var childDerived = derived(origins, wrappedDerive, initial);
	
	var singleOrigin = !Array.isArray(origins);
	var sendUpstream = (setWith) => {
		allowDerive = false;
		if (singleOrigin) {
			origins.set(setWith);
		} else {
			setWith.forEach( (value, i) => {
				origins[i].set(value);
			} );
		}
		allowDerive = true;
	};
	if (reflectOldValues) {
		reflect = reflect.withOld;
	}
	var reflectIsAsync = reflect.length >= (reflectOldValues ? 3 : 2);
	var cleanup = null;
	function doReflect(reflecting) {
		if (cleanup) {
			cleanup();
			cleanup = null;
		}

		if (reflectOldValues) {
			var returned = reflect(reflecting, originValues, sendUpstream);
		} else {
			var returned = reflect(reflecting, sendUpstream);
		}
		if (reflectIsAsync) {
			if (typeof returned == "function") {
				cleanup = returned;
			}
		} else {
			sendUpstream(returned);
		}
	}
	
	var tryingSet = false;
	function update(fn) {
		var isUpdated, mutatedBySubscriptions, oldValue, newValue;
		if (tryingSet) {
			newValue = fn( get(childDerived) );
			childDerivedSetter(newValue);
			return;
		}
		var unsubscribe = childDerived.subscribe( (value) => {
			if (!tryingSet) {
				oldValue = value;
			} else if (!isUpdated) {
				isUpdated = true;
			} else {
				mutatedBySubscriptions = true;
			}
		} );
		newValue = fn(oldValue);
		tryingSet = true;
		childDerivedSetter(newValue);
		unsubscribe();
		tryingSet = false;
		if (mutatedBySubscriptions) {
			newValue = get(childDerived);
		}
		if (isUpdated) {
			doReflect(newValue);
		}
	}
	return {
		subscribe: childDerived.subscribe,
		set(value) { update( () => value ); },
		update,
	};
}

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
function propertyStore(origin, propName) {
	if (!Array.isArray(propName)) {
		return writableDerived(
			origin,
			(object) => object[propName],
			{ withOld(reflecting, object) {
				object[propName] = reflecting;
				return object;
			} }
		);
	} else {
		let props = propName.concat();
		return writableDerived(
			origin,
			(value) => {
				for (let i = 0; i < props.length; ++i) {
					value = value[ props[i] ];
				}
				return value;
			},
			{ withOld(reflecting, object) {
				let target = object;
				for (let i = 0; i < props.length - 1; ++i) {
					target = target[ props[i] ];
				}
				target[ props[props.length - 1] ] = reflecting;
				return object;
			} }
		);
	}
}

export { DynArrayReducer, LocalStorage, SessionStorage, isReadableStore, isUpdatableStore, isWritableStore, propertyStore, subscribeFirstRest, subscribeIgnoreFirst, writableDerived };
//# sourceMappingURL=index.js.map

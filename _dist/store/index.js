import { isIterable } from '@typhonjs-svelte/lib/util';
import { get, writable as writable$2, derived } from 'svelte/store';
import { noop, run_all, is_function } from 'svelte/internal';

/**
 * Provides a readable store to track keys actively pressed. KeyStore is designed to be used with the {@link keyforward}
 * action.
 */
class KeyStore
{
   #keySet;

   /**
    * @type {Map<string, number>}
    */
   #keyMap = new Map();

   /**
    * @type {KeyStoreOptions}
    */
   #options = { preventDefault: true, useCode: true, stopPropagation: true };

   /**
    * Stores the subscribers.
    *
    * @type {(function(KeyStore): void)[]}
    */
   #subscriptions = [];

   /**
    * @param {Iterable<string>}  [keyNames] -
    *
    * @param {KeyStoreOptions}   [options] - Optional parameters
    */
   constructor(keyNames, options)
   {
      if (!isIterable(keyNames))
      {
         throw new TypeError(`'keyNames' is not an iterable list.`);
      }

      this.setOptions(options);

      this.#keySet = new Set(keyNames);
   }

   /**
    * Add given key to the tracking key set.
    *
    * @param {string}   key - Key to add.
    */
   addKey(key)
   {
      if (typeof key !== 'string') { throw new TypeError(`'key' is not a string.`); }

      this.#keySet.add(key);
   }

   /**
    * @returns {boolean} True if any keys in the key set are pressed.
    */

   /**
    * Returns true if any of given keys are pressed. If `keys` is undefined then the result is true if any keys being
    * tracked are pressed.
    *
    * @param {string|Iterable<string>|undefined} keys - Zero or more key strings or list to verify if any pressed.
    *
    * @returns {boolean} True if any keys set are pressed.
    */
   anyPressed(keys)
   {
      // When no keys given then check if any key is pressed.
      if (keys === void 0) { return this.#keyMap.size > 0; }

      const isList = isIterable(keys);

      if (typeof keys !== 'string' && !isList)
      {
         throw new TypeError(`'keys' is not a string or iterable list of strings.`);
      }

      let result = false;

      if (isList)
      {
         for (const key of keys)
         {
            if (this.#keyMap.has(key))
            {
               result = true;
               break;
            }
         }
      }
      else
      {
         if (this.#keyMap.has(keys)) { result = true; }
      }

      return result;
   }

   /**
    * Is the given key in the tracking key set.
    *
    * @param {string}   key - Key to check.
    */
   hasKey(key)
   {
      if (typeof key !== 'string') { throw new TypeError(`'key' is not a string.`); }

      this.#keySet.has(key);
   }

   /**
    * Returns true if all given keys are pressed.
    *
    * @param {string|Iterable<string>} keys - One or more key strings to verify if pressed.
    *
    * @returns {boolean} Are all keys pressed.
    */
   isPressed(keys)
   {
      const isList = isIterable(keys);

      if (typeof keys !== 'string' && !isList)
      {
         throw new TypeError(`'keys' is not a string or iterable list of strings.`);
      }

      let result = true;

      if (isList)
      {
         for (const key of keys)
         {
            if (!this.#keyMap.has(key))
            {
               result = false;
               break;
            }
         }
      }
      else
      {
         if (!this.#keyMap.has(keys)) { result = false; }
      }

      return result;
   }

   /**
    * Handle keydown event adding any key from the tracked key set.
    *
    * @param {KeyboardEvent}  event - KeyboardEvent.
    */
   keydown(event)
   {
      const key = this.#options.useCode ? event.code : event.key;

      if (this.#keySet.has(key))
      {
         if (!this.#keyMap.has(key))
         {
            this.#keyMap.set(key, 1);
            this._updateSubscribers();
         }

         if (this.#options.preventDefault) { event.preventDefault(); }
         if (this.#options.stopPropagation) { event.stopPropagation(); }
      }
   }

   /**
    * @returns {IterableIterator<string>} Returns current pressed keys iterator.
    */
   keysPressed()
   {
      return this.#keyMap.keys();
   }

   /**
    * @returns {IterableIterator<string>} Returns currently tracked keys iterator.
    */
   keysTracked()
   {
      return this.#keySet.keys();
   }

   /**
    * Handle keyup event removing any key from the tracked key set.
    *
    * @param {KeyboardEvent}  event - KeyboardEvent.
    */
   keyup(event)
   {
      const key = this.#options.useCode ? event.code : event.key;

      if (this.#keySet.has(key))
      {
         if (this.#keyMap.has(key))
         {
            this.#keyMap.delete(key);
            this._updateSubscribers();
         }

         if (this.#options.preventDefault) { event.preventDefault(); }
         if (this.#options.stopPropagation) { event.stopPropagation(); }
      }
   }

   /**
    * Remove the given key from the tracking key set.
    *
    * @param {string}   key - Key to remove.
    */
   removeKey(key)
   {
      if (typeof key !== 'string') { throw new TypeError(`'key' is not a string.`); }

      if (this.#keySet.has(key))
      {
         this.#keySet.delete(key);

         if (this.#keyMap.has(key))
         {
            this.#keyMap.delete(key);
            this._updateSubscribers();
         }
      }
   }

   /**
    * Update options.
    *
    * @param {KeyStoreOptions}   options - Options to set.
    */
   setOptions(options)
   {
      if (typeof options?.preventDefault === 'boolean') { this.#options.preventDefault = options.preventDefault; }
      if (typeof options?.useCode === 'boolean') { this.#options.useCode = options.useCode; }
      if (typeof options?.stopPropagation === 'boolean') { this.#options.stopPropagation = options.stopPropagation; }
   }

   /**
    * @param {string}   key - key or key code to lookup.
    *
    * @returns {number} 1 if currently pressed and 0 if not pressed.
    */
   value(key)
   {
      return this.#keyMap.has(key) ? 1 : 0;
   }

   // Store subscriber implementation --------------------------------------------------------------------------------

   /**
    * @param {function(KeyStore): void} handler - Callback function that is invoked on update / changes.
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
    * Updates subscribers.
    *
    * @protected
    */
   _updateSubscribers()
   {
      for (let cntr = 0; cntr < this.#subscriptions.length; cntr++) { this.#subscriptions[cntr](this); }
   }
}

/**
 * @typedef {object} KeyStoreOptions
 *
 * @property {boolean}  [preventDefault=true] - Invoke `preventDefault` on key events.
 *
 * @property {boolean}  [useCode=true] - When true use `event.code` otherwise use `event.key` to get active key.
 *
 * @property {boolean}  [stopPropagation=true] - Invoke `stopPropagation` on key events.
 */

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

class TJSLocalStorage
{
   /**
    * @type {Map<string, import('#svelte/store').Writable>}
    */
   #stores = new Map();

   /**
    * Creates a new writable store for the given key.
    *
    * @param {string}   key - Key to lookup in stores map.
    *
    * @param {boolean}  [defaultValue] - A default value to set for the store.
    *
    * @returns {import('#svelte/store').Writable} The new store.
    */
   static #createStore(key, defaultValue = void 0)
   {
      try
      {
         const value = localStorage.getItem(key);
         if (value !== null) { defaultValue = value === 'undefined' ? void 0 : JSON.parse(value); }
      }
      catch (err) { /**/ }

      return writable$1(key, defaultValue);
   }

   /**
    * Gets a store from the stores Map or creates a new store for the key and a given default value.
    *
    * @param {string}               key - Key to lookup in stores map.
    *
    * @param {boolean}              [defaultValue] - A default value to set for the store.
    *
    * @returns {import('#svelte/store').Writable} The store for the given key.
    */
   #getStore(key, defaultValue = void 0)
   {
      let store = this.#stores.get(key);
      if (store === void 0)
      {
         store = TJSLocalStorage.#createStore(key, defaultValue);
         this.#stores.set(key, store);
      }

      return store;
   }

   /**
    * Get value from the localStorage.
    *
    * @param {string}   key - Key to lookup in localStorage.
    *
    * @param {*}        [defaultValue] - A default value to return if key not present in session storage.
    *
    * @returns {*} Value from session storage or if not defined any default value provided.
    */
   getItem(key, defaultValue)
   {
      let value = defaultValue;

      const storageValue = localStorage.getItem(key);

      if (storageValue !== null)
      {
         try
         {
            value = storageValue === 'undefined' ? void 0 : JSON.parse(storageValue);
         }
         catch (err)
         {
            value = defaultValue;
         }
      }
      else if (defaultValue !== void 0)
      {
         try
         {
            const newValue = JSON.stringify(defaultValue);

            // If there is no existing storage value and defaultValue is defined the storage value needs to be set.
            localStorage.setItem(key, newValue === 'undefined' ? void 0 : newValue);
         }
         catch (err) { /* */ }
      }

      return value;
   }

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
   getStore(key, defaultValue)
   {
      return this.#getStore(key, defaultValue);
   }

   /**
    * Sets the value for the given key in localStorage.
    *
    * @param {string}   key - Key to lookup in localStorage.
    *
    * @param {*}        value - A value to set for this key.
    */
   setItem(key, value)
   {
      const store = this.#getStore(key);
      store.set(value);
   }

   /**
    * Convenience method to swap a boolean value stored in session storage.
    *
    * @param {string}   key - Key to lookup in localStorage.
    *
    * @param {boolean}  [defaultValue] - A default value to return if key not present in session storage.
    *
    * @returns {boolean} The boolean swap for the given key.
    */
   swapItemBoolean(key, defaultValue)
   {
      const store = this.#getStore(key, defaultValue);

      let currentValue = false;

      try
      {
         currentValue = !!JSON.parse(localStorage.getItem(key));
      }
      catch (err) { /**/ }

      const newValue = typeof currentValue === 'boolean' ? !currentValue : false;

      store.set(newValue);
      return newValue;
   }
}

// src/session.ts
var storage = typeof window !== "undefined" ? window.sessionStorage : void 0;
var g = generator(storage);
var writable = g.writable;

class TJSSessionStorage
{
   /**
    * @type {Map<string, import('#svelte/store').Writable>}
    */
   #stores = new Map();

   /**
    * Creates a new store for the given key.
    *
    * @param {string}   key - Key to lookup in stores map.
    *
    * @param {boolean}  [defaultValue] - A default value to set for the store.
    *
    * @returns {import('#svelte/store').Writable} The new store.
    */
   static #createStore(key, defaultValue = void 0)
   {
      try
      {
         const value = sessionStorage.getItem(key);
         if (value !== null) { defaultValue = value === 'undefined' ? void 0 : JSON.parse(value); }
      }
      catch (err) { /**/ }

      return writable(key, defaultValue);
   }

   /**
    * Gets a store from the `stores` Map or creates a new store for the key and a given default value.
    *
    * @param {string}               key - Key to lookup in stores map.
    *
    * @param {boolean}              [defaultValue] - A default value to set for the store.
    *
    * @returns {import('#svelte/store').Writable} The store for the given key.
    */
   #getStore(key, defaultValue = void 0)
   {
      let store = this.#stores.get(key);
      if (store === void 0)
      {
         store = TJSSessionStorage.#createStore(key, defaultValue);
         this.#stores.set(key, store);
      }

      return store;
   }

   /**
    * Get value from the sessionStorage.
    *
    * @param {string}   key - Key to lookup in sessionStorage.
    *
    * @param {*}        [defaultValue] - A default value to return if key not present in session storage.
    *
    * @returns {*} Value from session storage or if not defined any default value provided.
    */
   getItem(key, defaultValue)
   {
      let value = defaultValue;

      const storageValue = sessionStorage.getItem(key);

      if (storageValue !== null)
      {
         try
         {
            value = storageValue === 'undefined' ? void 0 : JSON.parse(storageValue);
         }
         catch (err)
         {
            value = defaultValue;
         }
      }
      else if (defaultValue !== void 0)
      {
         try
         {
            const newValue = JSON.stringify(defaultValue);

            // If there is no existing storage value and defaultValue is defined the storage value needs to be set.
            sessionStorage.setItem(key, newValue === 'undefined' ? void 0 : newValue);
         }
         catch (err) { /* */ }
      }

      return value;
   }

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
   getStore(key, defaultValue)
   {
      return this.#getStore(key, defaultValue);
   }

   /**
    * Sets the value for the given key in sessionStorage.
    *
    * @param {string}   key - Key to lookup in sessionStorage.
    *
    * @param {*}        value - A value to set for this key.
    */
   setItem(key, value)
   {
      const store = this.#getStore(key);
      store.set(value);
   }

   /**
    * Convenience method to swap a boolean value stored in session storage.
    *
    * @param {string}   key - Key to lookup in sessionStorage.
    *
    * @param {boolean}  [defaultValue] - A default value to return if key not present in session storage.
    *
    * @returns {boolean} The boolean swap for the given key.
    */
   swapItemBoolean(key, defaultValue)
   {
      const store = this.#getStore(key, defaultValue);

      let currentValue = false;

      try
      {
         currentValue = !!JSON.parse(sessionStorage.getItem(key));
      }
      catch (err) { /**/ }

      const newValue = typeof currentValue === 'boolean' ? !currentValue : false;

      store.set(newValue);
      return newValue;
   }
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
function storeCallback(store, setCallback)
{
   if (!isWritableStore(store)) { throw new TypeError(`'store' is not a writable store.`); }
   if (typeof setCallback !== 'function') { throw new TypeError(`'setCallback' is not a function.`); }

   /** @type {import('#svelte/store').Writable<T>} */
   return {
      set: (value) =>
      {
         store.set(value);
         setCallback(store, value);
      },

      subscribe: store.subscribe,

      update: typeof store.update === 'function' ? store.update : void 0
   };
}

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
function subscribeIgnoreFirst(store, update)
{
   let firedFirst = false;

   return store.subscribe((value) =>
   {
      if (!firedFirst)
      {
         firedFirst = true;
      }
      else
      {
         update(value);
      }
   });
}

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
function subscribeFirstRest(store, first, update)
{
   let firedFirst = false;

   return store.subscribe((value) =>
   {
      if (!firedFirst)
      {
         firedFirst = true;
         first(value);
      }
      else
      {
         update(value);
      }
   });
}

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
 * @param {!Function} reflect Called when the derived store gets a new value via its `set` or
 * `update` methods, and determines new values for the origin stores.
 * [Read more...](https://github.com/PixievoltNo1/svelte-writable-derived#new-parameter-reflect)
 * @param [initial] The new store's initial value. Same as
 * [`derived`](https://svelte.dev/docs#run-time-svelte-store-writable)'s 3rd parameter.
 * 
 * @returns {Store} A writable store.
 */
function writableDerived(origins, derive, reflect, initial) {
	var childDerivedSetter, originValues, blockNextDerive = false;
	var reflectOldValues = reflect.length >= 2;
	var wrappedDerive = (got, set) => {
		childDerivedSetter = set;
		if (reflectOldValues) {
			originValues = got;
		}
		if (!blockNextDerive) {
			let returned = derive(got, set);
			if (derive.length < 2) {
				set(returned);
			} else {
				return returned;
			}
		}
		blockNextDerive = false;
	};
	var childDerived = derived(origins, wrappedDerive, initial);
	
	var singleOrigin = !Array.isArray(origins);
	function doReflect(reflecting) {
		var setWith = reflect(reflecting, originValues);
		if (singleOrigin) {
			blockNextDerive = true;
			origins.set(setWith);
		} else {
			setWith.forEach( (value, i) => {
				blockNextDerive = true;
				origins[i].set(value);
			} );
		}
		blockNextDerive = false;
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
			(reflecting, object) => {
				object[propName] = reflecting;
				return object;
			},
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
			(reflecting, object) => {
				let target = object;
				for (let i = 0; i < props.length - 1; ++i) {
					target = target[ props[i] ];
				}
				target[ props[props.length - 1] ] = reflecting;
				return object;
			},
		);
	}
}

export { KeyStore, TJSLocalStorage, TJSSessionStorage, isReadableStore, isUpdatableStore, isWritableStore, propertyStore, storeCallback, subscribeFirstRest, subscribeIgnoreFirst, writableDerived };
//# sourceMappingURL=index.js.map

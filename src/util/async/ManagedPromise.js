/**
 * Provides management of a single Promise that can be shared and accessed across JS & Svelte components. This allows a
 * Promise to be created and managed as part of the TRL application lifecycle and accessed safely in various control
 * flow scenarios. When resolution of the current managed Promise starts further interaction is prevented.
 *
 * Note: to enable debugging / log statements set the static `logging` variable to true.
 */
export class ManagedPromise
{
   /** @type {boolean} */
   static #logging = false;

   /** @type {{ isProcessing?: boolean, promise?: Promise, reject: Function, resolve: Function }} */
   #current;

   /**
    * @returns {boolean} Whether global logging is enabled.
    */
   static get logging()
   {
      return this.#logging;
   }

   /**
    * @returns {boolean} Whether there is an active managed Promise.
    */
   get isActive()
   {
      return this.#current !== void 0;
   }

   /**
    * @returns {boolean} Whether there is an active managed Promise and resolution is currently being processed.
    */
   get isProcessing()
   {
      return this.#current !== void 0 ? this.#current.isProcessing : false;
   }

   /**
    * Sets global logging enabled state.
    *
    * @param {boolean}  logging - New logging enabled state.
    */
   static set logging(logging)
   {
      if (typeof logging !== 'boolean')
      {
         throw new TypeError(`[TRL] ManagedPromise.logging error: 'logging' is not a boolean.`);
      }

      this.#logging = logging;
   }

   // ----------------------------------------------------------------------------------------------------------------

   /**
    * Resolves any current Promise with undefined and creates a new current Promise.
    *
    * @template T
    *
    * @param {object} opts - Options.
    *
    * @param {boolean}  [opts.reuse=false] - When true if there is an existing live Promise it is returned immediately.
    *
    * @returns {Promise<T>} The new current managed Promise.
    */
   create({ reuse = false } = {})
   {
      if (typeof reuse !== 'boolean')
      {
         throw new TypeError(`[TRL] ManagedPromise.create error: 'reuse' is not a boolean.`);
      }

      if (reuse && this.#current !== void 0 && this.#current.promise instanceof Promise)
      {
         if (ManagedPromise.#logging)
         {
            console.warn(`[TRL] ManagedPromise.create info: Reusing / returning existing managed Promise.`);
         }

         return this.#current.promise;
      }

      if (this.#current !== void 0)
      {
         if (ManagedPromise.#logging)
         {
            console.warn(
             `[TRL] ManagedPromise.create info: Creating a new Promise and resolving existing immediately.`);
         }

         this.#current.resolve(void 0);
         this.#current = void 0;
      }

      const promise = new Promise((resolve, reject) =>
      {
         this.#current = {
            isProcessing: false,
            reject,
            resolve
         };
      });

      this.#current.promise = promise;

      return promise;
   }

   /**
    * Gets the current Promise if any.
    *
    * @returns {Promise<any>} Current Promise.
    */
   get()
   {
      return this.#current ? this.#current.promise : void 0;
   }

   /**
    * Rejects the current Promise if applicable.
    *
    * @param {*}  [result] - Result to reject.
    *
    * @returns {boolean} Was the promise rejected.
    */
   reject(result = void 0)
   {
      // Early out as Promise resolution is currently processing.
      if (this.#current !== void 0 && this.#current.isProcessing)
      {
         if (ManagedPromise.#logging)
         {
            console.warn(`[TRL] ManagedPromise.reject info: Currently processing promise.`);
         }

         return true;
      }

      if (this.#current !== void 0)
      {
         this.#current.isProcessing = true;

         if (result instanceof Promise)
         {
            result.then((value) =>
            {
               this.#current.reject(value);
               this.#current = void 0;
            }).catch((err) =>
            {
               this.#current.reject(err);
               this.#current = void 0;
            });
         }
         else
         {
            this.#current.reject(result);
            this.#current = void 0;
         }

         return true;
      }
      else
      {
         if (ManagedPromise.#logging)
         {
            console.warn(`[TRL] ManagedPromise.reject warning: No current managed Promise to reject.`);
         }

         return false;
      }
   }

   /**
    * Resolves the current Promise if applicable.
    *
    * @param {*}  [result] - Result to resolve.
    *
    * @returns {boolean} Was the promise resolved.
    */
   resolve(result = void 0)
   {
      // Early out as Promise resolution is currently processing.
      if (this.#current !== void 0 && this.#current.isProcessing)
      {
         if (ManagedPromise.#logging)
         {
            console.warn(`[TRL] ManagedPromise.resolve info: Currently processing promise.`);
         }

         return true;
      }

      if (this.#current !== void 0)
      {
         if (result instanceof Promise)
         {
            this.#current.isProcessing = true;

            result.then((value) =>
            {
               this.#current.resolve(value);
               this.#current = void 0;
            }).catch((err) =>
            {
               this.#current.reject(err);
               this.#current = void 0;
            });
         }
         else
         {
            this.#current.resolve(result);
            this.#current = void 0;
         }

         return true;
      }
      else
      {
         if (ManagedPromise.#logging)
         {
            console.warn(`[TRL] ManagedPromise.resolve warning: No current managed Promise to resolve.`);
         }

         return false;
      }
   }
}

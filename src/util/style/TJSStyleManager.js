import {
   isIterable,
   isObject }  from '#runtime/util/object';

/**
 * Provides a managed dynamic style sheet / element useful in configuring global CSS variables. When creating an
 * instance of TJSStyleManager you must provide a "document key" / string for the style element added. The style element
 * can be accessed via `document[docKey]`.
 *
 * Instances of TJSStyleManager can also be versioned by supplying a positive integer greater than or equal to `1` via
 * the 'version' option. This version number is assigned to the associated style element. When a TJSStyleManager
 * instance is created and there is an existing instance with a version that is lower than the current instance all CSS
 * rules are removed letting the higher version to take precedence. This isn't a perfect system and requires thoughtful
 * construction of CSS variables exposed, but allows multiple independently compiled TRL packages to load the latest
 * CSS variables. It is recommended to always set `overwrite` option of {@link TJSStyleManager.setProperty} and
 * {@link TJSStyleManager.setProperties} to `false` when loading initial values.
 */
export class TJSStyleManager
{
   /** @type {CSSStyleRule} */
   #cssRule;

   /** @type {string} */
   #docKey;

   /** @type {string} */
   #selector;

   /** @type {HTMLStyleElement} */
   #styleElement;

   /** @type {number} */
   #version;

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
    * @param {number}   [opts.version] - An integer representing the version / level of styles being managed.
    */
   constructor({ docKey, selector = ':root', document = globalThis.document, version } = {})
   {
      if (typeof docKey !== 'string') { throw new TypeError(`StyleManager error: 'docKey' is not a string.`); }

      // TODO: Verify 'document' type from Popout FVTT module. For some reason the popout document trips this
      //  unintentionally.
      // if (!(document instanceof Document))
      // {
      //    throw new TypeError(`TJSStyleManager error: 'document' is not an instance of Document.`);
      // }

      if (typeof selector !== 'string') { throw new TypeError(`StyleManager error: 'selector' is not a string.`); }

      if (version !== void 0 && !Number.isSafeInteger(version) && version < 1)
      {
         throw new TypeError(`StyleManager error: 'version' is defined and is not a positive integer >= 1.`);
      }

      this.#selector = selector;
      this.#docKey = docKey;
      this.#version = version;

      if (document[this.#docKey] === void 0)
      {
         this.#styleElement = document.createElement('style');

         document.head.append(this.#styleElement);

         // Set initial style manager version if any supplied.
         this.#styleElement._STYLE_MANAGER_VERSION = version;

         this.#styleElement.sheet.insertRule(`${selector} {}`, 0);

         this.#cssRule = this.#styleElement.sheet.cssRules[0];

         document[docKey] = this.#styleElement;
      }
      else
      {
         this.#styleElement = document[docKey];
         this.#cssRule = this.#styleElement.sheet.cssRules[0];

         if (version)
         {
            const existingVersion = this.#styleElement._STYLE_MANAGER_VERSION ?? 0;

            // Remove all existing CSS rules / text if version is greater than existing version.
            if (version > existingVersion)
            {
               this.#cssRule.style.cssText = '';
            }
         }
      }
   }

   /**
    * @returns {string} Provides an accessor to get the `cssText` for the style sheet.
    */
   get cssText()
   {
      return this.#cssRule.style.cssText;
   }

   /**
    * @returns {number} Returns the version of this instance.
    */
   get version()
   {
      return this.#version;
   }

   /**
    * Provides a copy constructor to duplicate an existing TJSStyleManager instance into a new document.
    *
    * Note: This is used to support the `PopOut` module.
    *
    * @param {Document} [document] Target browser document to clone into.
    *
    * @returns {TJSStyleManager} New style manager instance.
    */
   clone(document = globalThis.document)
   {
      const newStyleManager = new TJSStyleManager({
         selector: this.#selector,
         docKey: this.#docKey,
         document,
         version: this.#version
      });

      newStyleManager.#cssRule.style.cssText = this.#cssRule.style.cssText;

      return newStyleManager;
   }

   get()
   {
      const cssText = this.#cssRule.style.cssText;

      const result = {};

      if (cssText !== '')
      {
         for (const entry of cssText.split(';'))
         {
            if (entry !== '')
            {
               const values = entry.split(':');
               result[values[0].trim()] = values[1];
            }
         }
      }

      return result;
   }

   /**
    * Gets a particular CSS variable.
    *
    * @param {string}   key - CSS variable property key.
    *
    * @returns {string} Returns CSS variable value.
    */
   getProperty(key)
   {
      if (typeof key !== 'string') { throw new TypeError(`StyleManager error: 'key' is not a string.`); }

      return this.#cssRule.style.getPropertyValue(key);
   }

   /**
    * Set rules by property / value; useful for CSS variables.
    *
    * @param {{ [key: string]: string }}  rules - An object with property / value string pairs to load.
    *
    * @param {boolean}                 [overwrite=true] - When true overwrites any existing values.
    */
   setProperties(rules, overwrite = true)
   {
      if (!isObject(rules)) { throw new TypeError(`StyleManager error: 'rules' is not an object.`); }

      if (typeof overwrite !== 'boolean') { throw new TypeError(`StyleManager error: 'overwrite' is not a boolean.`); }

      if (overwrite)
      {
         for (const [key, value] of Object.entries(rules))
         {
            this.#cssRule.style.setProperty(key, value);
         }
      }
      else
      {
         // Only set property keys for entries that don't have an existing rule set.
         for (const [key, value] of Object.entries(rules))
         {
            if (this.#cssRule.style.getPropertyValue(key) === '')
            {
               this.#cssRule.style.setProperty(key, value);
            }
         }
      }
   }

   /**
    * Sets a particular property.
    *
    * @param {string}   key - CSS variable property key.
    *
    * @param {string}   value - CSS variable value.
    *
    * @param {boolean}  [overwrite=true] - Overwrite any existing value.
    */
   setProperty(key, value, overwrite = true)
   {
      if (typeof key !== 'string') { throw new TypeError(`StyleManager error: 'key' is not a string.`); }

      if (typeof value !== 'string') { throw new TypeError(`StyleManager error: 'value' is not a string.`); }

      if (typeof overwrite !== 'boolean') { throw new TypeError(`StyleManager error: 'overwrite' is not a boolean.`); }

      if (overwrite)
      {
         this.#cssRule.style.setProperty(key, value);
      }
      else
      {
         if (this.#cssRule.style.getPropertyValue(key) === '')
         {
            this.#cssRule.style.setProperty(key, value);
         }
      }
   }

   /**
    * Removes the property keys specified. If `keys` is an iterable list then all property keys in the list are removed.
    *
    * @param {Iterable<string>} keys - The property keys to remove.
    */
   removeProperties(keys)
   {
      if (!isIterable(keys)) { throw new TypeError(`StyleManager error: 'keys' is not an iterable list.`); }

      for (const key of keys)
      {
         if (typeof key === 'string') { this.#cssRule.style.removeProperty(key); }
      }
   }

   /**
    * Removes a particular CSS variable.
    *
    * @param {string}   key - CSS variable property key.
    *
    * @returns {string} CSS variable value when removed.
    */
   removeProperty(key)
   {
      if (typeof key !== 'string') { throw new TypeError(`StyleManager error: 'key' is not a string.`); }

      return this.#cssRule.style.removeProperty(key);
   }
}

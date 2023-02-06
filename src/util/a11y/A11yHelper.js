import {
   isIterable,
   isObject } from '@typhonjs-utils/object';

/**
 * Provides several helpful utility methods for accessibility and keyboard navigation.
 */
export class A11yHelper
{
   /**
    * Apply focus to the HTMLElement targets in a given A11yFocusSource data object. An iterable list `options.focusEl`
    * can contain HTMLElements or selector strings. If multiple focus targets are provided in a list then the first
    * valid target found will be focused. If focus target is a string then a lookup via `document.querySelector` is
    * performed. In this case you should provide a unique selector for the desired focus target.
    *
    * Note: The body of this method is postponed to the next clock tick to allow any changes in the DOM to occur that
    * might alter focus targets before applying.
    *
    * @param {A11yFocusSource|{ focusSource: A11yFocusSource }}   options - The focus options instance to apply.
    */
   static applyFocusSource(options)
   {
      if (!isObject(options)) { return; }

      // Handle the case of receiving an object with embedded `focusSource`.
      const focusOpts = isObject(options?.focusSource) ? options.focusSource : options;

      setTimeout(() =>
      {
         const debug = typeof focusOpts.debug === 'boolean' ? focusOpts.debug : false;

         if (isIterable(focusOpts.focusEl))
         {
            if (debug)
            {
               console.debug(`A11yHelper.applyFocusSource debug - Attempting to apply focus target: `, focusOpts.focusEl);
            }

            for (const target of focusOpts.focusEl)
            {
               if (target instanceof HTMLElement && target.isConnected)
               {
                  target.focus();
                  if (debug)
                  {
                     console.debug(`A11yHelper.applyFocusSource debug - Applied focus to target: `, target);
                  }
                  break;
               }
               else if (typeof target === 'string')
               {
                  const element = document.querySelector(target);
                  if (element instanceof HTMLElement && element.isConnected)
                  {
                     element.focus();
                     if (debug)
                     {
                        console.debug(`A11yHelper.applyFocusSource debug - Applied focus to target: `, element);
                     }
                     break;
                  }
                  else if (debug)
                  {
                     console.debug(`A11yHelper.applyFocusSource debug - Could not query selector: `, target);
                  }
               }
            }
         }
         else if (debug)
         {
            console.debug(`A11yHelper.applyFocusSource debug - No focus targets defined.`);
         }
      }, 0);
   }

   /**
    * Returns first focusable element within a specified element.
    *
    * @param {HTMLElement|Document} [element=document] - Optional element to start query.
    *
    * @param {object} [options] - Optional parameters.
    *
    * @param {Iterable<string>} [options.ignoreClasses] - Iterable list of classes to ignore elements.
    *
    * @param {Set<HTMLElement>} [options.ignoreElements] - Set of elements to ignore.
    *
    * @returns {HTMLElement} First focusable child element
    */
   static getFirstFocusableElement(element = document, options)
   {
      const focusableElements = this.getFocusableElements(element, options);

      return focusableElements.length > 0 ? focusableElements[0] : void 0;
   }

   /**
    * Returns all focusable elements within a specified element.
    *
    * @param {HTMLElement|Document} [element=document] Optional element to start query.
    *
    * @param {object}            [options] - Optional parameters.
    *
    * @param {boolean}           [options.anchorHref=true] - When true anchors must have an HREF.
    *
    * @param {Iterable<string>}  [options.ignoreClasses] - Iterable list of classes to ignore elements.
    *
    * @param {Set<HTMLElement>}  [options.ignoreElements] - Set of elements to ignore.
    *
    * @param {string}            [options.selectors] - Custom list of focusable selectors for `querySelectorAll`.
    *
    * @returns {Array<HTMLElement>} Child keyboard focusable
    */
   static getFocusableElements(element = document, { anchorHref = true, ignoreClasses, ignoreElements, selectors } = {})
   {
      if (!(element instanceof HTMLElement) && !(element instanceof Document))
      {
         throw new TypeError(`'element' is not a HTMLElement or Document instance.`);
      }

      if (typeof anchorHref !== 'boolean')
      {
         throw new TypeError(`'anchorHref' is not a boolean.`);
      }

      if (ignoreClasses !== void 0 && !isIterable(ignoreClasses))
      {
         throw new TypeError(`'ignoreClasses' is not an iterable list.`);
      }

      if (ignoreElements !== void 0 && !(ignoreElements instanceof Set))
      {
         throw new TypeError(`'ignoreElements' is not a Set.`);
      }

      if (selectors !== void 0 && typeof selectors !== 'string')
      {
         throw new TypeError(`'selectors' is not a string.`);
      }

      const selectorQuery = selectors ?? this.#getFocusableSelectors(anchorHref);

      const allElements = [...element.querySelectorAll(selectorQuery)];

      if (ignoreElements && ignoreClasses)
      {
         return allElements.filter((el) =>
         {
            let hasIgnoreClass = false;
            for (const ignoreClass of ignoreClasses)
            {
               if (el.classList.contains(ignoreClass))
               {
                  hasIgnoreClass = true;
                  break;
               }
            }

            return !hasIgnoreClass && !ignoreElements.has(el) && el.style.display !== 'none' &&
             el.style.visibility !== 'hidden' && !el.hasAttribute('disabled') && !el.hasAttribute('inert') &&
              el.getAttribute('aria-hidden') !== 'true';
         });
      }
      else if (ignoreClasses)
      {
         return allElements.filter((el) =>
         {
            let hasIgnoreClass = false;
            for (const ignoreClass of ignoreClasses)
            {
               if (el.classList.contains(ignoreClass))
               {
                  hasIgnoreClass = true;
                  break;
               }
            }

            return !hasIgnoreClass && el.style.display !== 'none' && el.style.visibility !== 'hidden' &&
             !el.hasAttribute('disabled') && !el.hasAttribute('inert') && el.getAttribute('aria-hidden') !== 'true';
         });
      }
      else if (ignoreElements)
      {
         return allElements.filter((el) =>
         {
            return !ignoreElements.has(el) && el.style.display !== 'none' && el.style.visibility !== 'hidden' &&
             !el.hasAttribute('disabled') && !el.hasAttribute('inert') && el.getAttribute('aria-hidden') !== 'true';
         });
      }
      else
      {
         return allElements.filter((el) =>
         {
            return el.style.display !== 'none' && el.style.visibility !== 'hidden' && !el.hasAttribute('disabled') &&
             !el.hasAttribute('inert') && el.getAttribute('aria-hidden') !== 'true';
         });
      }
   }

   /**
    * Returns the default focusable selectors query.
    *
    * @param {boolean}  [anchorHref=true] - When true anchors must have an HREF.
    *
    * @returns {string} Focusable selectors for `querySelectorAll`.
    */
   static #getFocusableSelectors(anchorHref = true)
   {
      return `button, [contenteditable=""], [contenteditable="true"], details summary:not([tabindex="-1"]), embed, a${
       anchorHref ? '[href]' : ''}, iframe, object, input:not([type=hidden]), select, textarea, ` +
        `[tabindex]:not([tabindex="-1"])`;
   }

   /**
    * Gets a A11yFocusSource object from the given DOM event allowing for optional X / Y screen space overrides.
    * Browsers (Firefox / Chrome) forwards a mouse event for the context menu keyboard button. Provides detection of
    * when the context menu event is from the keyboard. Firefox as of (1/23) does not provide the correct screen space
    * coordinates, so for keyboard context menu presses coordinates are generated from the centroid point of the
    * element.
    *
    * A default fallback element or selector string may be provided to provide the focus target. If the event comes from
    * the keyboard however the source focused element is inserted as the target with the fallback value appended to the
    * list of focus targets. When A11yFocusSource is applied by {@link A11yHelper.applyFocusSource} the target focus
    * list is iterated through until a connected target is found and focus applied.
    *
    * @param {object} options - Options
    *
    * @param {KeyboardEvent|MouseEvent}   [options.event] - The source DOM event.
    *
    * @param {boolean} [options.debug] - When true {@link A11yHelper.applyFocusSource} logs focus target data.
    *
    * @param {HTMLElement|string} [options.focusEl] - A specific HTMLElement or selector string as the focus target.
    *
    * @param {number}   [options.x] - Used when an event isn't provided; integer of event source in screen space.
    *
    * @param {number}   [options.y] - Used when an event isn't provided; integer of event source in screen space.
    *
    * @returns {A11yFocusSource} A A11yFocusSource object.
    *
    * @see https://bugzilla.mozilla.org/show_bug.cgi?id=1426671
    * @see https://bugzilla.mozilla.org/show_bug.cgi?id=314314
    *
    * TODO: Evaluate / test against touch input devices.
    */
   static getFocusSource({ event, x, y, focusEl, debug = false })
   {
      if (focusEl !== void 0 && !(focusEl instanceof HTMLElement) && typeof focusEl !== 'string')
      {
         throw new TypeError(
          `A11yHelper.getFocusSource error: 'focusEl' is not a HTMLElement or string.`);
      }

      if (debug !== void 0 && typeof debug !== 'boolean')
      {
         throw new TypeError(`A11yHelper.getFocusSource error: 'debug' is not a boolean.`);
      }

      // Handle the case when no event is provided and x, y, or focusEl is explicitly defined.
      if (event === void 0)
      {
         if (typeof x !== 'number')
         {
            throw new TypeError(`A11yHelper.getFocusSource error: 'event' not defined and 'x' is not a number.`);
         }

         if (typeof y !== 'number')
         {
            throw new TypeError(`A11yHelper.getFocusSource error: 'event' not defined and 'y' is not a number.`);
         }

         return {
            debug,
            focusEl: focusEl !== void 0 ? [focusEl] : void 0,
            x,
            y,
         };
      }

      if (!(event instanceof KeyboardEvent) && !(event instanceof MouseEvent))
      {
         throw new TypeError(`A11yHelper.getFocusSource error: 'event' is not a KeyboardEvent or MouseEvent.`);
      }

      if (x !== void 0 && !Number.isInteger(x))
      {
         throw new TypeError(`A11yHelper.getFocusSource error: 'x' is not a number.`);
      }

      if (y !== void 0 && !Number.isInteger(y))
      {
         throw new TypeError(`A11yHelper.getFocusSource error: 'y' is not a number.`);
      }

      /** @type {HTMLElement} */
      const targetEl = event.target;

      if (!(targetEl instanceof HTMLElement))
      {
         throw new TypeError(`A11yHelper.getFocusSource error: 'event.target' is not an HTMLElement.`);
      }

      const result = { debug };

      if (event instanceof MouseEvent)
      {
         // Firefox currently (1/23) does not correctly determine the location of a keyboard originated
         // context menu location, so calculate position from middle of the event target.
         // Firefox fires a mouse event for the context menu key.
         if (event?.button !== 2 && event.type === 'contextmenu')
         {
            const rect = targetEl.getBoundingClientRect();
            result.x = x ?? rect.left + (rect.width / 2);
            result.y = y ?? rect.top + (rect.height / 2);
            result.focusEl = focusEl !== void 0 ? [targetEl, focusEl] : [targetEl];
            result.source = 'keyboard';
         }
         else
         {
            result.x = x ?? event.pageX;
            result.y = y ?? event.pageY;
            result.focusEl = focusEl !== void 0 ? [focusEl] : void 0;
         }
      }
      else
      {
         const rect = targetEl.getBoundingClientRect();
         result.x = x ?? rect.left + (rect.width / 2);
         result.y = y ?? rect.top + (rect.height / 2);
         result.focusEl = focusEl !== void 0 ? [targetEl, focusEl] : [targetEl];
         result.source = 'keyboard';
      }

      return result;
   }

   /**
    * Returns first focusable element within a specified element.
    *
    * @param {HTMLElement|Document} [element=document] - Optional element to start query.
    *
    * @param {object} [options] - Optional parameters.
    *
    * @param {Iterable<string>} [options.ignoreClasses] - Iterable list of classes to ignore elements.
    *
    * @param {Set<HTMLElement>} [options.ignoreElements] - Set of elements to ignore.
    *
    * @returns {HTMLElement} First focusable child element
    */
   static getLastFocusableElement(element = document, options)
   {
      const focusableElements = this.getFocusableElements(element, options);

      return focusableElements.length > 0 ? focusableElements[focusableElements.length - 1] : void 0;
   }

   /**
    * Tests if the given element is focusable.
    *
    * @param {HTMLElement} [el] - Element to test.
    *
    * @param {object} [options] - Optional parameters.
    *
    * @param {boolean} [options.anchorHref=true] - When true anchors must have an HREF.
    *
    * @param {Iterable<string>} [options.ignoreClasses] - Iterable list of classes to ignore elements.
    *
    * @returns {boolean} Element is focusable.
    */
   static isFocusable(el, { anchorHref = true, ignoreClasses } = {})
   {
      if (el === void 0 || el === null || !(el instanceof HTMLElement) || el?.hidden || !el?.isConnected)
      {
         return false;
      }

      if (typeof anchorHref !== 'boolean')
      {
         throw new TypeError(`'anchorHref' is not a boolean.`);
      }

      if (ignoreClasses !== void 0 && !isIterable(ignoreClasses))
      {
         throw new TypeError(`'ignoreClasses' is not an iterable list.`);
      }

      const contenteditableAttr = el.getAttribute('contenteditable');
      const contenteditableFocusable = typeof contenteditableAttr === 'string' &&
       (contenteditableAttr === '' || contenteditableAttr === 'true');

      const tabindexAttr = el.getAttribute('tabindex');
      const tabindexFocusable = typeof tabindexAttr === 'string' && tabindexAttr !== '-1';

      const isAnchor = el instanceof HTMLAnchorElement;

      if (contenteditableFocusable || tabindexFocusable || isAnchor || el instanceof HTMLButtonElement ||
       el instanceof HTMLDetailsElement || el instanceof HTMLEmbedElement || el instanceof HTMLIFrameElement ||
        el instanceof HTMLInputElement || el instanceof HTMLObjectElement || el instanceof HTMLSelectElement ||
         el instanceof HTMLTextAreaElement)
      {
         if (isAnchor && anchorHref && typeof el.getAttribute('href') !== 'string')
         {
            return false;
         }

         return el.style.display !== 'none' && el.style.visibility !== 'hidden' && !el.hasAttribute('disabled') &&
          !el.hasAttribute('inert') && el.getAttribute('aria-hidden') !== 'true';
      }

      return false;
   }

   /**
    * Convenience method to check if the given data is a valid focus source.
    *
    * @param {HTMLElement|string}   data - Either an HTMLElement or selector string.
    *
    * @returns {boolean} Is valid focus source.
    */
   static isFocusSource(data)
   {
      return data instanceof HTMLElement || typeof data === 'string';
   }
}

/**
 * @typedef {object} A11yFocusSource - Provides essential data to return focus to an HTMLElement after a series of UI
 * actions like working with context menus and modal dialogs.
 *
 * @property {boolean} [debug] - When true logs to console the actions taken in {@link A11yHelper.applyFocusSource}.
 *
 * @property {Iterable<HTMLElement|string>} [focusEl] - List of targets to attempt to focus.
 *
 * @property {string} [source] - The source of the event: 'keyboard' for instance.
 *
 * @property {number} [x] - Potential X coordinate of initial event.
 *
 * @property {number} [y] - Potential Y coordinate of initial event.
 */

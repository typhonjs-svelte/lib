import { isIterable } from '@typhonjs-utils/object';

/**
 * Provides several helpful utility methods for accessibility and keyboard navigation.
 */
export class A11yHelper
{
   /**
    * Returns first focusable element within a specified element.
    *
    * @param {HTMLElement|Document} [element=document] - Optional element to start query.
    *
    * @param {object} [options] - Iterable list of classes to ignore elements.
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
    * @param {object} [options] - Iterable list of classes to ignore elements.
    *
    * @param {Iterable<string>} [options.ignoreClasses] - Iterable list of classes to ignore elements.
    *
    * @param {Set<HTMLElement>} [options.ignoreElements] - Set of elements to ignore.
    *
    * @returns {Array<HTMLElement>} Child keyboard focusable
    */
   static getFocusableElements(element = document, { ignoreClasses, ignoreElements } = {})
   {
      if (!(element instanceof HTMLElement) && !(element instanceof Document))
      {
         throw new TypeError(`'element' is not a HTMLElement or Document instance.`);
      }

      if (ignoreClasses !== void 0 && !isIterable(ignoreClasses))
      {
         throw new TypeError(`'ignoreClasses' is not an iterable list.`);
      }

      if (ignoreElements !== void 0 && !(ignoreElements instanceof Set))
      {
         throw new TypeError(`'ignoreElements' is not a Set.`);
      }

      const allElements = [...element.querySelectorAll(
       'a[href], button, details, embed, iframe, input, object, select, textarea, [tabindex]:not([tabindex="-1"])')];

      if (ignoreElements && ignoreClasses)
      {
         return allElements.filter((el) => {
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
             el.style.visibility !== 'hidden' && !el.hasAttribute('disabled') &&
              el.getAttribute('aria-hidden') !== 'true';
         });
      }
      else if (ignoreClasses)
      {
         return allElements.filter((el) => {
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
             !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true';
         });
      }
      else if (ignoreElements)
      {
         return allElements.filter((el) => {
            return !ignoreElements.has(el) && el.style.display !== 'none' && el.style.visibility !== 'hidden' &&
             !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true';
         });
      }
      else
      {
         return allElements.filter((el) => {
            return el.style.display !== 'none' && el.style.visibility !== 'hidden' && !el.hasAttribute('disabled') &&
             el.getAttribute('aria-hidden') !== 'true';
         });
      }
   }

   /**
    * Returns first focusable element within a specified element.
    *
    * @param {HTMLElement|Document} [element=document] - Optional element to start query.
    *
    * @param {object} [options] - Iterable list of classes to ignore elements.
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
}

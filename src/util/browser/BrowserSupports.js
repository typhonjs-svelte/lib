/**
 * Provides utility methods for checking browser capabilities.
 *
 * TODO: perhaps add support for various standard media query checks for level 4 & 5.
 * @see https://kilianvalkhof.com/2021/web/detecting-media-query-support-in-css-and-javascript/
 */
export class BrowserSupports
{
   /**
    * Check for container query support.
    *
    * @returns {boolean} True if container queries supported.
    */
   static get containerQueries()
   {
      return 'container' in document.documentElement.style;
   }
}

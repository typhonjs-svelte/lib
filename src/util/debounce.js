/**
 * Wraps a callback in a debounced timeout.
 *
 * Delay execution of the callback function until the function has not been called for the given delay in milliseconds.
 *
 * @param {Function} callback - A function to execute once the debounced threshold has been passed.
 *
 * @param {number}   delay - An amount of time in milliseconds to delay.
 *
 * @returns {Function} A wrapped function that can be called to debounce execution.
 */
export function debounce(callback, delay)
{
   let timeoutId;

   return function(...args)
   {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => { callback.apply(this, args); }, delay);
   };
}

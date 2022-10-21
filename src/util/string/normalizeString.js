/**
 * Normalizes a string.
 *
 * @param {string}   query - A string to normalize for comparisons.
 *
 * @returns {string} Cleaned string.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize
 */
export function normalizeString(query)
{
   return query.trim().normalize('NFD').replace(/[\x00-\x1F]/gm, ''); // eslint-disable-line no-control-regex
}

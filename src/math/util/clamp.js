/**
 * Clamps a value between min / max values.
 *
 * @param {number}   value - Value to clamp.
 *
 * @param {number}   min - Minimum value.
 *
 * @param {number}   max - Maximum value.
 *
 * @returns {number} Clamped value.
 */
export function clamp(value = 0, min = 0, max = 0)
{
   return Math.min(Math.max(value, min), max);
}

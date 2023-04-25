export * from './TJSPosition.js';

export * from './transform/index.js';
export * from './TJSPositionData.js';

// From: position/animation/AnimationAPI.js --------------------------------------------------------------------------

/**
 * @callback quickToCallback
 *
 * @param {...number|object} args - Either individual numbers corresponding to the order in which keys are specified or
 *                                  a single object with keys specified and numerical values.
 *
 * @property {(data: {duration?: number, ease?: Function, interpolate?: Function}) => quickToCallback} options - A
 *                                  function to update options for quickTo function.
 */

// From: position/TJSPosition.js ----------------------------------------------------------------------------------------

/**
 * @typedef {object} TJSPositionInitialHelper
 *
 * @property {(width: number) => number} getLeft - Returns the left position given the width of the browser window.
 *
 * @property {(height: number) => number} getTop - Returns the top position given the height of the browser window.
 */

/**
 * @typedef {object} TJSPositionGetOptions
 *
 * @property {Iterable<string>} keys - When provided only these keys are copied.
 *
 * @property {Iterable<string>} exclude - When provided these keys are excluded.
 *
 * @property {boolean} numeric - When true any `null` values are converted into defaults.
 */

/**
 * @typedef {object} TJSPositionOptions - Options set in constructor.
 *
 * @property {boolean} calculateTransform - When true always calculate transform data.
 *
 * @property {TJSPositionInitialHelper} initialHelper - Provides a helper for setting initial position data.
 *
 * @property {boolean} ortho - Sets TJSPosition to orthographic mode using just transform / matrix3d for positioning.
 *
 * @property {boolean} transformSubscribed - Set to true when there are subscribers to the readable transform store.
 */

/**
 * @typedef {TJSPositionOptions & import('./').TJSPositionData} TJSPositionOptionsAll
 */

/**
 * @typedef {HTMLElement | object} TJSPositionParent
 *
 * @property {Function} [elementTarget] - Potentially returns any parent object.
 */

/**
 * @typedef {object} ResizeObserverData
 *
 * @property {number|undefined} contentHeight -
 *
 * @property {number|undefined} contentWidth -
 *
 * @property {number|undefined} offsetHeight -
 *
 * @property {number|undefined} offsetWidth -
 */

/**
 * @typedef {object} StorePosition - Provides individual writable stores for {@link TJSPosition}.
 *
 * @property {import('#svelte/store').Readable<{width: number, height: number}>} dimension - Readable store for dimension
 *                                                                                          data.
 *
 * @property {import('#svelte/store').Readable<HTMLElement>} element - Readable store for current element.
 *
 * @property {import('#svelte/store').Writable<number|null>} left - Derived store for `left` updates.
 *
 * @property {import('#svelte/store').Writable<number|null>} top - Derived store for `top` updates.
 *
 * @property {import('#svelte/store').Writable<number|'auto'|null>} width - Derived store for `width` updates.
 *
 * @property {import('#svelte/store').Writable<number|'auto'|null>} height - Derived store for `height` updates.
 *
 * @property {import('#svelte/store').Writable<number|null>} maxHeight - Derived store for `maxHeight` updates.
 *
 * @property {import('#svelte/store').Writable<number|null>} maxWidth - Derived store for `maxWidth` updates.
 *
 * @property {import('#svelte/store').Writable<number|null>} minHeight - Derived store for `minHeight` updates.
 *
 * @property {import('#svelte/store').Writable<number|null>} minWidth - Derived store for `minWidth` updates.
 *
 * @property {import('#svelte/store').Readable<number|undefined>} resizeContentHeight - Readable store for `contentHeight`.
 *
 * @property {import('#svelte/store').Readable<number|undefined>} resizeContentWidth - Readable store for `contentWidth`.
 *
 * @property {import('#svelte/store').Writable<ResizeObserverData>} resizeObserved - Protected store for resize observer updates.
 *
 * @property {import('#svelte/store').Readable<number|undefined>} resizeOffsetHeight - Readable store for `offsetHeight`.
 *
 * @property {import('#svelte/store').Readable<number|undefined>} resizeOffsetWidth - Readable store for `offsetWidth`.
 *
 * @property {import('#svelte/store').Writable<number|null>} rotate - Derived store for `rotate` updates.
 *
 * @property {import('#svelte/store').Writable<number|null>} rotateX - Derived store for `rotateX` updates.
 *
 * @property {import('#svelte/store').Writable<number|null>} rotateY - Derived store for `rotateY` updates.
 *
 * @property {import('#svelte/store').Writable<number|null>} rotateZ - Derived store for `rotateZ` updates.
 *
 * @property {import('#svelte/store').Writable<number|null>} scale - Derived store for `scale` updates.
 *
 * @property {import('#svelte/store').Readable<import('./transform').TJSTransformData>} transform - Readable store for
 *           transform data.
 *
 * @property {import('#svelte/store').Writable<string>} transformOrigin - Derived store for `transformOrigin`.
 *
 * @property {import('#svelte/store').Writable<number|null>} translateX - Derived store for `translateX` updates.
 *
 * @property {import('#svelte/store').Writable<number|null>} translateY - Derived store for `translateY` updates.
 *
 * @property {import('#svelte/store').Writable<number|null>} translateZ - Derived store for `translateZ` updates.
 *
 * @property {import('#svelte/store').Writable<number|null>} zIndex - Derived store for `zIndex` updates.
 */

/**
 * @typedef {object} TJSPositionDataExtended
 *
 * @property {number|string|null} [height] -
 *
 * @property {number|string|null} [left] -
 *
 * @property {number|string|null} [maxHeight] -
 *
 * @property {number|string|null} [maxWidth] -
 *
 * @property {number|string|null} [minHeight] -
 *
 * @property {number|string|null} [minWidth] -
 *
 * @property {number|string|null} [rotateX] -
 *
 * @property {number|string|null} [rotateY] -
 *
 * @property {number|string|null} [rotateZ] -
 *
 * @property {number|string|null} [scale] -
 *
 * @property {number|string|null} [top] -
 *
 * @property {string|null} [transformOrigin] -
 *
 * @property {number|string|null} [translateX] -
 *
 * @property {number|string|null} [translateY] -
 *
 * @property {number|string|null} [translateZ] -
 *
 * @property {number|string|null} [width] -
 *
 * @property {number|string|null} [zIndex] -
 *
 * Extended properties -----------------------------------------------------------------------------------------------
 *
 * @property {boolean} [immediateElementUpdate] - When true any associated element is updated immediately.
 *
 * @property {number|null} [rotation] - Alias for `rotateZ`.
 */

// From: position/transform/TJSTransformData.js -------------------------------------------------------------------------

/**
 * @typedef {Float32Array} Vector3 - 3 Dimensional Vector.
 *
 * @see https://glmatrix.net/docs/module-vec3.html
 */

/**
 * @typedef {Float32Array} Matrix4 - 4x4 Matrix; Format: column-major, when typed out it looks like row-major.
 *
 * @see https://glmatrix.net/docs/module-mat4.html
 */

/**
 * @typedef {'top left' | 'top center' | 'top right' | 'center left' | 'center' | 'center right' | 'bottom left' | 'bottom center' | 'bottom right' } TJSTransformOrigin - The supported transform origin strings.
 */

// From: position/validators/AdapterValidators.js --------------------------------------------------------------------

/**
 * @typedef {object} ValidationData
 *
 * @property {import('./').TJSPositionData} position -
 *
 * @property {TJSPositionParent} parent -
 *
 * @property {HTMLElement} el -
 *
 * @property {CSSStyleDeclaration} computed -
 *
 * @property {import('./transform').TJSTransforms} transforms -
 *
 * @property {number} height -
 *
 * @property {number} width -
 *
 * @property {number|undefined} marginLeft -
 *
 * @property {number|undefined} marginTop -
 *
 * @property {number|undefined} maxHeight -
 *
 * @property {number|undefined} maxWidth -
 *
 * @property {number|undefined} minHeight -
 *
 * @property {number|undefined} minWidth -
 *
 * @property {object} rest - The rest of any data submitted to {@link TJSPosition.set}
 */

/**
 * @callback ValidatorFn - TJSPosition validator function that takes a {@link TJSPositionData} instance potentially
 *                             modifying it or returning null if invalid.
 *
 * @param {ValidationData} valData - Validation data.
 *
 * @returns {import('./TJSPositionData').TJSPositionData | null} The validated position data or null to cancel position
 *          update.
 */

/**
 * @typedef {object} ValidatorData
 *
 * @property {*}           [id=undefined] - An ID associated with this validator. Can be used to remove the validator.
 *
 * @property {ValidatorFn} validator - TJSPosition validator function that takes a {@link TJSPositionData} instance
 *           potentially modifying it or returning null if invalid.
 *
 * @property {number}      [weight=1] - A number between 0 and 1 inclusive to position this validator against others.
 *
 * @property {Function}    [subscribe] - Optional subscribe function following the Svelte store / subscribe pattern.
 */

/**
 * @typedef {ValidatorFn|ValidatorData|Iterable<ValidatorFn|ValidatorData>} TJSPositionValidatorOptions Defines the
 *          position validator options.
 */

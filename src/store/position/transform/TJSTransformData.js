import { Mat4, Vec3 }   from '#runtime/math/gl-matrix';

/**
 * Provides the output data for {@link import('./').TJSTransforms.getData}.
 */
export class TJSTransformData
{
   constructor()
   {
      Object.seal(this);
   }

   /**
    * Stores the calculated bounding rectangle.
    *
    * @type {DOMRect}
    */
   #boundingRect = new DOMRect();

   /**
    * Stores the individual transformed corner points of the window in screen space clockwise from:
    * top left -> top right -> bottom right -> bottom left.
    *
    * @type {import('#runtime/math/gl-matrix').Vec3[]}
    */
   #corners = [Vec3.create(), Vec3.create(), Vec3.create(), Vec3.create()];

   /**
    * Stores the current gl-matrix Mat4 data.
    *
    * @type {import('#runtime/math/gl-matrix').Mat4}
    */
   #mat4 = Mat4.create();

   /**
    * Stores the pre & post origin translations to apply to matrix transforms.
    *
    * @type {import('#runtime/math/gl-matrix').Mat4[]}
    */
   #originTranslations = [Mat4.create(), Mat4.create()];

   /**
    * @returns {DOMRect} The bounding rectangle.
    */
   get boundingRect() { return this.#boundingRect; }

   /**
    * @returns {import('#runtime/math/gl-matrix').Vec3[]} The transformed corner points as Vec3 in screen space.
    */
   get corners() { return this.#corners; }

   /**
    * @returns {string} Returns the CSS style string for the transform matrix.
    */
   get css() { return `matrix3d(${this.mat4.join(',')})`; }

   /**
    * @returns {import('#runtime/math/gl-matrix').Mat4} The transform matrix.
    */
   get mat4() { return this.#mat4; }

   /**
    * @returns {import('#runtime/math/gl-matrix').Mat4[]} The pre / post translation matrices for origin translation.
    */
   get originTranslations() { return this.#originTranslations; }
}

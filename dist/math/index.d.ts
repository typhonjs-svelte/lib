declare var rematrix_es: Readonly<{
    __proto__: any;
    format: typeof format;
    fromString: typeof fromString;
    identity: typeof identity;
    inverse: typeof inverse;
    multiply: typeof multiply;
    perspective: typeof perspective;
    rotate: typeof rotate;
    rotateX: typeof rotateX;
    rotateY: typeof rotateY;
    rotateZ: typeof rotateZ;
    scale: typeof scale;
    scaleX: typeof scaleX;
    scaleY: typeof scaleY;
    scaleZ: typeof scaleZ;
    skew: typeof skew;
    skewX: typeof skewX;
    skewY: typeof skewY;
    toString: typeof toString;
    translate: typeof translate;
    translate3d: typeof translate3d;
    translateX: typeof translateX;
    translateY: typeof translateY;
    translateZ: typeof translateZ;
}>;
/**
 * Performs linear interpolation between a start & end value by given amount between 0 - 1 inclusive.
 *
 * @param {number}   start - Start value.
 *
 * @param {number}   end - End value.
 *
 * @param {number}   amount - Current amount between 0 - 1 inclusive.
 *
 * @returns {number} Linear interpolated value between start & end.
 */
declare function lerp(start: number, end: number, amount: number): number;
/*! @license Rematrix v0.7.2

    Copyright 2021 Julian Lloyd.

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.
*/
declare function format(source: any): any[];
declare function fromString(source: any): any[];
declare function identity(): number[];
declare function inverse(source: any): number[];
declare function multiply(matrixA: any, matrixB: any): number[];
declare function perspective(distance: any): number[];
declare function rotate(angle: any): number[];
declare function rotateX(angle: any): number[];
declare function rotateY(angle: any): number[];
declare function rotateZ(angle: any): number[];
declare function scale(scalar: any, scalarY: any): number[];
declare function scaleX(scalar: any): number[];
declare function scaleY(scalar: any): number[];
declare function scaleZ(scalar: any): number[];
declare function skew(angleX: any, angleY: any): number[];
declare function skewX(angle: any): number[];
declare function skewY(angle: any): number[];
declare function toString(source: any): string;
declare function translate(distanceX: any, distanceY: any): number[];
declare function translate3d(distanceX: any, distanceY: any, distanceZ: any): number[];
declare function translateX(distance: any): number[];
declare function translateY(distance: any): number[];
declare function translateZ(distance: any): number[];

export { rematrix_es as Rematrix, lerp };

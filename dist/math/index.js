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
function lerp(start, end, amount)
{
   return (1 - amount) * start + amount * end;
}

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
function format(source) {
  if (source && source.constructor === Array) {
    var values = source
      .filter(function (value) { return typeof value === 'number'; })
      .filter(function (value) { return !isNaN(value); });

    if (source.length === 6 && values.length === 6) {
      var matrix = identity();
      matrix[0] = values[0];
      matrix[1] = values[1];
      matrix[4] = values[2];
      matrix[5] = values[3];
      matrix[12] = values[4];
      matrix[13] = values[5];
      return matrix
    } else if (source.length === 16 && values.length === 16) {
      return source
    }
  }
  throw new TypeError('Expected a `number[]` with length 6 or 16.')
}

function fromString(source) {
  if (typeof source === 'string') {
    var match = source.match(/matrix(3d)?\(([^)]+)\)/);
    if (match) {
      var raw = match[2].split(',').map(parseFloat);
      return format(raw)
    }
    if (source === 'none' || source === '') {
      return identity()
    }
  }
  throw new TypeError('Expected a string containing `matrix()` or `matrix3d()')
}

function identity() {
  var matrix = [];
  for (var i = 0; i < 16; i++) {
    i % 5 == 0 ? matrix.push(1) : matrix.push(0);
  }
  return matrix
}

function inverse(source) {
  var m = format(source);

  var s0 = m[0] * m[5] - m[4] * m[1];
  var s1 = m[0] * m[6] - m[4] * m[2];
  var s2 = m[0] * m[7] - m[4] * m[3];
  var s3 = m[1] * m[6] - m[5] * m[2];
  var s4 = m[1] * m[7] - m[5] * m[3];
  var s5 = m[2] * m[7] - m[6] * m[3];

  var c5 = m[10] * m[15] - m[14] * m[11];
  var c4 = m[9] * m[15] - m[13] * m[11];
  var c3 = m[9] * m[14] - m[13] * m[10];
  var c2 = m[8] * m[15] - m[12] * m[11];
  var c1 = m[8] * m[14] - m[12] * m[10];
  var c0 = m[8] * m[13] - m[12] * m[9];

  var determinant = 1 / (s0 * c5 - s1 * c4 + s2 * c3 + s3 * c2 - s4 * c1 + s5 * c0);

  if (isNaN(determinant) || determinant === Infinity) {
    throw new Error('Inverse determinant attempted to divide by zero.')
  }

  return [
    (m[5] * c5 - m[6] * c4 + m[7] * c3) * determinant,
    (-m[1] * c5 + m[2] * c4 - m[3] * c3) * determinant,
    (m[13] * s5 - m[14] * s4 + m[15] * s3) * determinant,
    (-m[9] * s5 + m[10] * s4 - m[11] * s3) * determinant,

    (-m[4] * c5 + m[6] * c2 - m[7] * c1) * determinant,
    (m[0] * c5 - m[2] * c2 + m[3] * c1) * determinant,
    (-m[12] * s5 + m[14] * s2 - m[15] * s1) * determinant,
    (m[8] * s5 - m[10] * s2 + m[11] * s1) * determinant,

    (m[4] * c4 - m[5] * c2 + m[7] * c0) * determinant,
    (-m[0] * c4 + m[1] * c2 - m[3] * c0) * determinant,
    (m[12] * s4 - m[13] * s2 + m[15] * s0) * determinant,
    (-m[8] * s4 + m[9] * s2 - m[11] * s0) * determinant,

    (-m[4] * c3 + m[5] * c1 - m[6] * c0) * determinant,
    (m[0] * c3 - m[1] * c1 + m[2] * c0) * determinant,
    (-m[12] * s3 + m[13] * s1 - m[14] * s0) * determinant,
    (m[8] * s3 - m[9] * s1 + m[10] * s0) * determinant ]
}

function multiply(matrixA, matrixB) {
  var fma = format(matrixA);
  var fmb = format(matrixB);
  var product = [];

  for (var i = 0; i < 4; i++) {
    var row = [fma[i], fma[i + 4], fma[i + 8], fma[i + 12]];
    for (var j = 0; j < 4; j++) {
      var k = j * 4;
      var col = [fmb[k], fmb[k + 1], fmb[k + 2], fmb[k + 3]];
      var result = row[0] * col[0] + row[1] * col[1] + row[2] * col[2] + row[3] * col[3];

      product[i + k] = result;
    }
  }

  return product
}

function perspective(distance) {
  var matrix = identity();
  matrix[11] = -1 / distance;
  return matrix
}

function rotate(angle) {
  return rotateZ(angle)
}

function rotateX(angle) {
  var theta = (Math.PI / 180) * angle;
  var matrix = identity();

  matrix[5] = matrix[10] = Math.cos(theta);
  matrix[6] = matrix[9] = Math.sin(theta);
  matrix[9] *= -1;

  return matrix
}

function rotateY(angle) {
  var theta = (Math.PI / 180) * angle;
  var matrix = identity();

  matrix[0] = matrix[10] = Math.cos(theta);
  matrix[2] = matrix[8] = Math.sin(theta);
  matrix[2] *= -1;

  return matrix
}

function rotateZ(angle) {
  var theta = (Math.PI / 180) * angle;
  var matrix = identity();

  matrix[0] = matrix[5] = Math.cos(theta);
  matrix[1] = matrix[4] = Math.sin(theta);
  matrix[4] *= -1;

  return matrix
}

function scale(scalar, scalarY) {
  var matrix = identity();

  matrix[0] = scalar;
  matrix[5] = typeof scalarY === 'number' ? scalarY : scalar;

  return matrix
}

function scaleX(scalar) {
  var matrix = identity();
  matrix[0] = scalar;
  return matrix
}

function scaleY(scalar) {
  var matrix = identity();
  matrix[5] = scalar;
  return matrix
}

function scaleZ(scalar) {
  var matrix = identity();
  matrix[10] = scalar;
  return matrix
}

function skew(angleX, angleY) {
  var thetaX = (Math.PI / 180) * angleX;
  var matrix = identity();

  matrix[4] = Math.tan(thetaX);

  if (angleY) {
    var thetaY = (Math.PI / 180) * angleY;
    matrix[1] = Math.tan(thetaY);
  }

  return matrix
}

function skewX(angle) {
  var theta = (Math.PI / 180) * angle;
  var matrix = identity();

  matrix[4] = Math.tan(theta);

  return matrix
}

function skewY(angle) {
  var theta = (Math.PI / 180) * angle;
  var matrix = identity();

  matrix[1] = Math.tan(theta);

  return matrix
}

function toString(source) {
  return ("matrix3d(" + (format(source).join(', ')) + ")")
}

function translate(distanceX, distanceY) {
  var matrix = identity();
  matrix[12] = distanceX;

  if (distanceY) {
    matrix[13] = distanceY;
  }

  return matrix
}

function translate3d(distanceX, distanceY, distanceZ) {
  var matrix = identity();
  if (distanceX !== undefined && distanceY !== undefined && distanceZ !== undefined) {
    matrix[12] = distanceX;
    matrix[13] = distanceY;
    matrix[14] = distanceZ;
  }
  return matrix
}

function translateX(distance) {
  var matrix = identity();
  matrix[12] = distance;
  return matrix
}

function translateY(distance) {
  var matrix = identity();
  matrix[13] = distance;
  return matrix
}

function translateZ(distance) {
  var matrix = identity();
  matrix[14] = distance;
  return matrix
}

var rematrix_es = /*#__PURE__*/Object.freeze({
   __proto__: null,
   format: format,
   fromString: fromString,
   identity: identity,
   inverse: inverse,
   multiply: multiply,
   perspective: perspective,
   rotate: rotate,
   rotateX: rotateX,
   rotateY: rotateY,
   rotateZ: rotateZ,
   scale: scale,
   scaleX: scaleX,
   scaleY: scaleY,
   scaleZ: scaleZ,
   skew: skew,
   skewX: skewX,
   skewY: skewY,
   toString: toString,
   translate: translate,
   translate3d: translate3d,
   translateX: translateX,
   translateY: translateY,
   translateZ: translateZ
});

export { rematrix_es as Rematrix, lerp };
//# sourceMappingURL=index.js.map

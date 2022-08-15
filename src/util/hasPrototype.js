/**
 * Returns whether the target is or has the given prototype walking up the prototype chain.
 *
 * @param {*}  target - Any target to test.
 *
 * @param {Function} Prototype - Prototype function / class constructor to find.
 *
 * @returns {boolean} Target matches prototype.
 */
export function hasPrototype(target, Prototype)
{
   /* c8 ignore next */
   if (typeof target !== 'function') { return false; }

   if (target === Prototype) { return true; }

   // Walk parent prototype chain. Check for descriptor at each prototype level.
   for (let proto = Object.getPrototypeOf(target); proto; proto = Object.getPrototypeOf(proto))
   {
      if (proto === Prototype) { return true; }
   }

   return false;
}

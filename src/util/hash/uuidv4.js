/**
 * Generates a UUID v4 compliant ID. Please use a complete UUID generation package for guaranteed compliance.
 *
 * This code is an evolution of the following Gist.
 * https://gist.github.com/jed/982883
 *
 * There is a public domain / free copy license attached to it that is not a standard OSS license...
 * https://gist.github.com/jed/982883#file-license-txt
 *
 * @returns {string} UUIDv4
 */
export function uuidv4()
{
   return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (c ^ (globalThis.crypto || globalThis.msCrypto).getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
}

import { writable }        from '#svelte/store';

import { TJSTransformData }   from '../transform/TJSTransformData.js';
import { TJSPositionData }    from '../TJSPositionData.js';

export class UpdateElementData
{
   constructor()
   {
      /**
       * Stores the private data from TJSPosition.
       *
       * @type {TJSPositionData}
       */
      this.data = void 0;

      /**
       * Provides a copy of local data sent to subscribers.
       *
       * @type {TJSPositionData}
       */
      this.dataSubscribers = new TJSPositionData();

      /**
       * Stores the current dimension data used for the readable `dimension` store.
       *
       * @type {{width: number | 'auto', height: number | 'auto'}}
       */
      this.dimensionData = { width: 0, height: 0 };

      /**
       * @type {PositionChangeSet}
       */
      this.changeSet = void 0;

      /**
       * @type {TJSPositionOptions}
       */
      this.options = void 0;

      /**
       * Stores if this TJSPosition / update data is queued for update.
       *
       * @type {boolean}
       */
      this.queued = false;

      /**
       * @type {StyleCache}
       */
      this.styleCache = void 0;

      /**
       * @type {TJSTransforms}
       */
      this.transforms = void 0;

      /**
       * Stores the current transform data used for the readable `transform` store. It is only active when there are
       * subscribers to the store or calculateTransform options is true.
       *
       * @type {TJSTransformData}
       */
      this.transformData = new TJSTransformData();

      /**
       * @type {(function(TJSPositionData): void)[]}
       */
      this.subscriptions = void 0;

      /**
       * @type {import('#svelte/store').Writable<{width: (number|"auto"), height: (number|"auto")}>}
       */
      this.storeDimension = writable(this.dimensionData);

      // When there are subscribers set option to calculate transform updates; set to false when no subscribers.

      /**
       * @type {import('#svelte/store').Writable<TJSTransformData>}
       */
      this.storeTransform = writable(this.transformData, () =>
      {
         this.options.transformSubscribed = true;
         return () => this.options.transformSubscribed = false;
      });

      /**
       * Stores the queued state for update element processing.
       *
       * @type {boolean}
       */
      this.queued = false;

      // Seal data backing readable stores.
      Object.seal(this.dimensionData);
   }
}

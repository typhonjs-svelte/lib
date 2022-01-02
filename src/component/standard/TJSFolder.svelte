<script>
   /**
    * TJSFolder provides a collapsible folder using the details and summary HTMLElements.
    *
    * This is a slotted component.
    *
    * ----------------------------------------------------------------------------------------------------------------
    * Exported props include:
    * `folder`: An object containing id (any), name (string), store (writable boolean)
    *
    * Or in lieu of passing the folder object you can assign these props directly:
    * `id`: Anything used for an ID.
    * `name`: The name of the folder; string.
    * `store`: The store tracking the open / close state: writable<boolean>
    *
    * The final prop is `styles` which follows the `applyStyles` action; see `applyStyles` or `StylesProperties`
    * component for more information. This is an object that applies inline styles.
    *
    * ----------------------------------------------------------------------------------------------------------------
    * Events: There are several events that are fired and / or bubbled up through parents. There are four
    * custom events that pass a details object including: `the details element, id, name, and store`.
    *
    * The following events are bubbled up such that assigning a listener in any parent component receives them
    * from all children folders:
    * `click` - Basic MouseEvent of folder being clicked.
    * `closeAny` - Triggered when any child folder is closed w/ details object.
    * `openAny` - Triggered when any child folder is opened w/ details object.
    *
    * The following events do not propagate / bubble up and can be registered with:
    * `close` - Triggered when direct descendent folder is closed w/ details object.
    * `open` - Triggered when direct descendent folder is opened w/ details object.
    *
    * ----------------------------------------------------------------------------------------------------------------
    * Styling: To style this component use `details.tjs-folder` as a selector.
    *
    * There are several local CSS variables that you can use to change the appearance dynamically. Either use
    * CSS props or pass in a `styles` object w/ key / value props to set to the details. Another alternative is using
    * `StyleProperties` component which wraps a section in locally defined CSS variables. Useful for a large group of
    * folders where the goal is changing the appearance of all of them as a group.
    *
    * The following CSS variables are supported, but not defined by default.
    *
    * Details element (attributes follow `--tjs-details-`):
    * --tjs-details-padding-left: 5px; set for children to indent more;
    *
    * Summary element (attributes follow `--tjs-summary-`):
    * --tjs-summary-background-blend-mode: initial
    * --tjs-summary-background: none
    * --tjs-summary-border: none
    * --tjs-summary-cursor: pointer
    * --tjs-summary-font-size: inherit
    * --tjs-summary-font-weight: bold
    * --tjs-summary-padding: 4px
    * --tjs-summary-width: fit-content; wraps content initially, set to 100% or other width measurement
    *
    * Summary SVG / chevron element (attributes follow `--tjs-summary-chevron-`):
    *
    * The width and height use multiple fallback variables before setting a default of 15px. You can provide
    * `--tjs-summary-chevron-size`. If not provided then the chevron dimensions are set by `--tjs-summary-font-size`.
    *
    * --tjs-summary-chevron-color: currentColor
    * --tjs-summary-chevron-opacity: 0.2; Opacity when not hovering.
    * --tjs-summary-chevron-rotate-closed: -90deg; rotation angle when closed.
    * --tjs-summary-chevron-opacity-hover: 1; Opacity when hovering.
    * --tjs-summary-chevron-rotate-open: 0; rotation angle when open.
    *
    * Contents element (attributes follow `--tjs-contents-`):
    * --tjs-contents-background-blend-mode: initial
    * --tjs-contents-background: none
    * --tjs-contents-border: none
    * --tjs-contents-margin: 0 0 0 -5px
    *
    * Padding is set directly by `--tjs-contents-padding` or follows the following calculation:
    * `0 0 0 calc(var(--tjs-summary-font-size, 13px) * 0.8)`
    *
    * If neither `--tjs-contents-padding` or `--tjs-summary-font-size` is defined the default is `13px * 0.8`.
    */

   import {
      createEventDispatcher,
      onDestroy }               from 'svelte';

   import { writable }          from 'svelte/store';

   import {
      applyStyles,
      toggleDetails }           from '@typhonjs-svelte/lib/action';

   export let styles;

   export let folder;
   export let name = folder ? folder.name : '';
   export let store = folder ? folder.store : writable(false);
   export let id = folder ? folder.id : void 0;

   let detailsEl;

   const dispatch = createEventDispatcher();

   // Manually subscribe to store in order to trigger only on changes; avoids initial dispatch on mount.
   const unsubscribe = store.subscribe((value) =>
   {
      dispatch(value ? 'open' : 'close', { element: detailsEl, id, name, store });
      dispatch(value ? 'openAny' : 'closeAny', { element: detailsEl, id, name, store });
   });

   onDestroy(unsubscribe);
</script>

<details class=tjs-folder
         bind:this={detailsEl}
         bind:open={$store}
         on:click
         on:openAny
         on:closeAny
         use:toggleDetails={store}
         use:applyStyles={styles}>
    <summary>
        <svg viewBox="0 0 24 24">
            <path
                fill=currentColor
                stroke=currentColor
                style="stroke-linejoin: round; stroke-width: 3;"
                d="M5,8L19,8L12,15Z"
            />
        </svg>

        {name}
    </summary>

    <div class=contents>
        <slot></slot>
    </div>
</details>

<style>
    details {
        margin-left: -5px;
        padding-left: var(--tjs-details-padding-left, 5px);   /* Set for children folders to increase indent */
    }

    summary {
        display: flex;
        position: relative;
        align-items: center;
        background-blend-mode: var(--tjs-summary-background-blend-mode, initial);
        background: var(--tjs-summary-background, none);
        border: var(--tjs-summary-border, none);
        cursor: var(--tjs-summary-cursor, pointer);
        font-size: var(--tjs-summary-font-size, inherit);
        font-weight: var(--tjs-summary-font-weight, bold);
        list-style: none;
        margin: 0 0 0 -5px;
        padding: var(--tjs-summary-padding, 4px) 0;
        user-select: none;
        width: var(--tjs-summary-width, fit-content);
    }

    summary svg {
        width: var(--tjs-summary-chevron-size, var(--tjs-summary-font-size, 15px));
        height: var(--tjs-summary-chevron-size, var(--tjs-summary-font-size, 15px));
        color: var(--tjs-summary-chevron-color, currentColor);
        opacity: var(--tjs-summary-chevron-opacity, 0.2);
        margin: 0 5px 0 0;
        transition: opacity 0.2s, transform 0.1s;
        transform: rotate(var(--tjs-summary-chevron-rotate-closed, -90deg));
    }

    summary:hover svg {
        opacity: var(--tjs-summary-chevron-opacity-hover, 1);
    }

    [open] > summary svg {
        transform: rotate(var(--tjs-summary-chevron-rotate-open, 0));
    }

    .contents {
        position: relative;
        background-blend-mode: var(--tjs-contents-background-blend-mode, initial);
        background: var(--tjs-contents-background, none);
        border: var(--tjs-contents-border, none);
        margin: var(--tjs-contents-margin, 0 0 0 -5px);
        padding: var(--tjs-contents-padding, 0 0 0 calc(var(--tjs-summary-font-size, 13px) * 0.8));
    }

    .contents::before {
        content: '';
        position: absolute;
        width: 0;
        height: calc(100% + 8px);
        left: 0;
        top: -8px;
    }

    summary:focus-visible + .contents::before {
        height: 100%;
        top: 0;
    }
</style>

<script>
   import { writable }  from 'svelte/store';

   import {
      applyStyles,
      toggleDetails }   from '@typhonjs-svelte/lib/action';

   export let styles;

   export let folder;
   export let name = folder ? folder.name : '';
   export let store = folder ? folder.store : writable(false);
</script>

<details bind:open={$store} use:toggleDetails={store} use:applyStyles={styles}>
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
        padding-left: 5px;
    }

    summary {
        display: flex;
        position: relative;
        align-items: center;
        background: var(--summary-background, none);
        border: var(--summary-border, none);
        font-size: var(--summary-font-size, inherit);
        font-weight: var(--summary-font-weight, bold);
        list-style: none;
        margin: 0 0 0 -5px;
        padding: var(--summary-padding, 4px) 0;
        user-select: none;
        width: var(--summary-width, fit-content);
    }

    summary svg {
        width: var(--summary-chevron-size, var(--summary-font-size, 15px));
        height: var(--summary-chevron-size, var(--summary-font-size, 15px));
        color: var(--summary-chevron-color, currentColor);
        opacity: var(--summary-chevron-opacity, 0.2);
        margin: 0 5px 0 0;
        transition: opacity 0.2s, transform 0.1s;
        transform: rotate(var(--summary-chevron-rotate-closed, -90deg));
    }

    summary:hover svg {
        opacity: var(--summary-chevron-opacity-hover, 1);
    }

    [open] > summary svg {
        transform: rotate(var(--summary-chevron-rotate-open, 0));
    }

    .contents {
        position: relative;
        background: var(--contents-background, none);
        border: var(--contents-border, none);
        margin: var(--contents-margin, 0 5px 0 -5px);
        padding: var(--contents-padding, 0 0 0 calc(var(--summary-font-size, 13px) * 0.8));
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

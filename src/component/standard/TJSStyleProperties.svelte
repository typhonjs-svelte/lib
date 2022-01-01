<script>
   import { applyStyles } from '@typhonjs-svelte/lib/action';

   export let styles;
</script>

<div use:applyStyles={styles}>
    <slot/>
</div>

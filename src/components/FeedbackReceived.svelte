<script>
  import { fade } from 'svelte/transition';

  export let item;
  export let key;

  $: bored = item.feeling === 'bored' ? true : false;
</script>


<div class="notification {bored ? 'is-success' : 'is-danger'}" in:fade>
  <h2 class="title is-5"><strong>{item.name}</strong> ({item.formattedTime})</h2>
</div>
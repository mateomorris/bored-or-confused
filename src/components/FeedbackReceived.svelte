<script>
  import { fade } from 'svelte/transition';

  export let item;
  export let key;

  $: bored = item.feeling === 'bored' ? true : false;

  let currentDate = new Date();
  let isExpired = item.created < (currentDate - 120000); // less than two minutes ago
</script>

<style>
  .expired {
    opacity: 0.5;
  }
</style>


<div class="notification {bored ? 'is-success' : 'is-danger'} {isExpired ? 'expired' : ''}" transition:fade="{{ duration: 250 }}">
  <h2 class="title is-5"><strong>{item.name}</strong> ({item.formattedTime})</h2>  
</div>
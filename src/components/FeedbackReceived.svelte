<script>
  export let item;

  $: bored = item.feeling === 'bored' ? true : false;
</script>


<div class="notification {bored ? 'is-success' : 'is-danger'}">
  <h2 class="title is-5"><strong>{item.name}</strong> ({item.formattedTime})</h2>
</div>
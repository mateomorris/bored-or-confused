<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

  function navigate(screen) {
    dispatch('navigate', {
      screen
    })
  }

</script>

<style>
	.button {
		height: 50vh;
	}
</style>

<h1 class="title">Bored or Confused</h1>
<h2 class="subtitle">
  A tool for discreetly giving feedback to an instructor while they're lecturing. Great for introverts.
</h2>
<div class="columns">
  <div class="column">
    <button class="button is-large is-fullwidth is-info" on:click={() => { navigate('student') }}>Student</button>
  </div>
  <div class="column">
    <button class="button is-large is-fullwidth is-success" on:click={() => { navigate('instructor') }}>Instructor</button>
  </div>
</div>
<script>
	import { fade, fly } from 'svelte/transition';
</script>

<svelte:head>
  <title>Bored or Confused</title>
</svelte:head>

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
    <a class="button is-large is-fullwidth is-info" href="/student">Student</a>
  </div>
  <div class="column">
    <a class="button is-large is-fullwidth is-success" href="/instructor">Instructor</a>
  </div>
</div>

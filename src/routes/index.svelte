<script>
	import { fade, fly } from 'svelte/transition';
  // import { db } from './firebase';
  // import { collectionData } from 'rxfire/firestore';
	// import { tap } from 'rxjs/operators';
	// import { object } from 'rxfire/database';
	// import moment from 'moment'

	// import StudentScreen from './StudentScreen.svelte';
	// import LecturerScreen from './LecturerScreen.svelte';
	// import LandingScreen from './screens/LandingScreen.svelte';

	
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
    <a class="button is-large is-fullwidth is-info" href="/student">Student</a>
  </div>
  <div class="column">
    <a class="button is-large is-fullwidth is-success" href="/instructor">Instructor</a>
  </div>
</div>

<svelte:head>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.5/css/bulma.min.css" />
</svelte:head>

<script>
	import { fade, fly } from 'svelte/transition';
  import { db } from './firebase';
  import { collectionData } from 'rxfire/firestore';
	import { tap } from 'rxjs/operators';
	import { object } from 'rxfire/database';
	import moment from 'moment'

	import StudentScreen from './StudentScreen.svelte';
	import LecturerScreen from './LecturerScreen.svelte';
	import LandingScreen from './screens/LandingScreen.svelte';

	let screen = 'landing';

	function navigate({ detail }) {
		screen = detail.screen;
	}
	
</script>

<style>

</style>

<body>
	<div class="container" in:fly="{{ y: -100, duration: 1000 }}">
		<div class="section">
			{#if screen == 'landing'}
				<LandingScreen on:navigate={navigate}/>
			{:else if screen == 'student'}
				 <StudentScreen/>
			{:else if screen == 'instructor'}
				<LecturerScreen/>
			{/if}
		</div>
	</div>
</body>



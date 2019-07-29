<svelte:head>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.5/css/bulma.min.css" />
</svelte:head>

<script>
	import { fade } from 'svelte/transition';
  import { db } from './firebase';
  import { collectionData } from 'rxfire/firestore';
	import { tap } from 'rxjs/operators';
	import { object } from 'rxfire/database';
	import moment from 'moment'
	import { Router, Link, Route } from "svelte-routing";

	import StudentScreen from './StudentScreen.svelte';
	import LecturerScreen from './LecturerScreen.svelte';
	
</script>

<style>

</style>

<body>
	<div class="container">


	<Router url="">
		<!-- <nav>
			<Link to="/">Home</Link>
			<Link to="about">About</Link>
			<Link to="blog">Blog</Link>
		</nav> -->
		<div>
			<Route path="/">
				<StudentScreen/>
			</Route>
			<Route path="/admin">
				<LecturerScreen/>
			</Route>
		</div>
	</Router>

	</div>
</body>



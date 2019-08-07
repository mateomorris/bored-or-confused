<svelte:head>
  <title>BoC - Student</title>
</svelte:head>

<script>
	import firebase from 'firebase/app';
	import { onDestroy } from "svelte";
	import { fly, fade } from 'svelte/transition';
  import { db } from '../firebase';
  import { collectionData } from 'rxfire/firestore';
	import { tap } from 'rxjs/operators';
	import { object } from 'rxfire/database';
	import moment from 'moment'

	import FeedbackSent from '../components/FeedbackSent.svelte';


	let classId = '';
	let name = ''; 
	let signedIn = false;
	let feedback = [];
  let clearDate = new Date();

	let inClass = false;
	let studentsInClass = [];

  let currentClass;
	let currentTopic;

	function enterClass() {

		currentClass = db.collection('classes')
    .doc(classId);

		currentClass.get().then(function(doc) {
				if (doc.exists) {
					inClass = true;

					currentClass.onSnapshot(function(doc) {
						let data = doc.data();

						currentTopic = data.activeTopic;

						studentsInClass = data.students;

						feedback = data.feedback
							.filter(i => i.name == name)
							.sort((a, b) => (a.created < b.created) ? 1 : -1)
							.map(stuff => ({
							...stuff,
							formattedTime: moment(stuff.created).fromNow()
						}));
					});
				} else {
					alert('Incorrect class ID');
				}
		}).catch(function(error) {
				console.log("Error getting document:", error);
		});

	}

	function leaveClass() {
		currentClass
			.update({ 
				students: studentsInClass.filter((student) => {
					return student !== name
				})
			});
	}

	function addName(name) {
		signedIn = true;
		name = name;

		currentClass
			.update({ 
				students: firebase.firestore.FieldValue.arrayUnion(name) 
			});

	}

	function handleFeeling({ target }) {

		currentClass
			.update({ 
				feedback: firebase.firestore.FieldValue.arrayUnion({
					name,
					feeling: target.value,
					created: Date.now(),
					topic: currentTopic
				}) 
			});

	}

	onDestroy(() => {
		// leaveClass();
	});
	
</script>

<style>
	button {
		height: 25vh;
	}
</style>


{#if !signedIn }
	<nav class="navbar is-light" role="navigation" aria-label="main navigation">
		<div class="navbar-brand">
			<a class="navbar-item site-logo title is-4" href="https://boredorconfused.com">Bored or Confused</a>
		</div>
	</nav>
	<hr/>
{/if}
<div class="container">
  {#if signedIn}
		{#if currentTopic }
			<div class="card" in:fly>
				<div class="card-content">
					<p class="title">{currentTopic}</p>
				</div>
			</div>
			<br>
		{/if}
    <div class="columns">
      <div class="column">
        <button class="button is-large is-dark is-fullwidth" on:click={handleFeeling} value="bored">Bored 😴</button>
      </div>
      <div class="column">
        <button class="button is-large is-dark is-fullwidth" on:click={handleFeeling} value="confused">Confused 😕</button>
      </div>
    </div>
    <hr/>
    {#each feedback as item (item.created)}
		  {#if (item.created >= clearDate) && (item.topic === currentTopic)}
      	<FeedbackSent item={item}/>
    	{/if}
    {/each}
  {:else}
    <div class="field">
      <div class="control">
				{#if !inClass}
					<form on:submit|preventDefault={enterClass}>
						<label class="label">Class ID</label>
						<input class="input is-large" type="text" placeholder="Class ID" bind:value={classId}>
					</form>
				{:else}
					<form on:submit|preventDefault={() => { addName(name) }}>
						<label class="label">Name</label>
						<input class="input is-large" type="text" placeholder="Name" bind:value={name}>
					</form>
				{/if}
      </div>
    </div>
  {/if}
</div>

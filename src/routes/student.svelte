<svelte:head>
  <title>BoC - Student</title>
</svelte:head>

<script>
	import firebase from 'firebase/app';
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


	function enterClass() {

		const currentClass = db.collection('classes').doc(classId);

		currentClass.get().then(function(doc) {
				if (doc.exists) {
					inClass = true;
					currentClass.onSnapshot(function(doc) {
						let data = doc.data();

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

	function addName(name) {
		signedIn = true;
		name = name;

		db.collection('classes')
			.doc(classId)
			.update({ 
				students: firebase.firestore.FieldValue.arrayUnion(name) 
			});

	}

	function handleClick({ target }) {

		db.collection('classes')
			.doc(classId)
			.update({ 
				feedback: firebase.firestore.FieldValue.arrayUnion({
					name,
					feeling: target.value,
					created: Date.now(),
				}) 
			});

	}
	
</script>

<style>
	button {
		height: 50vh;
	}
</style>

<div class="container">
	<h1 class="title">Bored or Confused</h1>
	<h2 class="subtitle">
		A tool for discreetly giving feedback to an instructor during a lecture. Great for introverts.
	</h2>
  {#if signedIn}
    <div class="columns">
      <div class="column">
        <button class="button is-large is-dark is-fullwidth" on:click={handleClick} value="bored">Bored 😴</button>
      </div>
      <div class="column">
        <button class="button is-large is-dark is-fullwidth" on:click={handleClick} value="confused">Confused 😕</button>
      </div>
    </div>
    <hr/>
    {#each feedback as item (item.created)}
		  {#if item.created >= clearDate}
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

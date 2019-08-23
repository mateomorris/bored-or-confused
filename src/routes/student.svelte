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

	let quizIsActive = false;
	let quizzes = [];
	$: currentQuiz = quizzes ? quizzes.find(q => q.topic === currentTopic) : null
	let currentAnswer;

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

						quizzes = data.quizzes

						// let alreadyAnswered = data.quizResponses.map(r => r.name).filter(r => r.topic === currentTopic).includes(name)
						let alreadyAnswered = data.quizResponses ? data.quizResponses.filter(r => r.topic === currentTopic).map(r => r.name).includes(name) : null

						if (alreadyAnswered) {
							quizIsActive = false;
						} else {
							quizIsActive = data.quizActive;
						}


						console.log(data)
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

	function addName() {
		signedIn = true;

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

	function handleSubmitAnswer() {
		quizIsActive = false;

		currentClass
			.update({ 
				quizResponses: firebase.firestore.FieldValue.arrayUnion({
					topic: currentTopic,
					name,
					answer: currentAnswer.label,
					correct: currentAnswer.correct
				})
			});
	}

	function handleIDK() {
		quizIsActive = false;

		currentClass
			.update({ 
				quizResponses: firebase.firestore.FieldValue.arrayUnion({
					topic: currentTopic,
					name,
					answer: null
				})
			});
	}

	function answerIsSelected() {
		return currentAnswer && answer.label === currentAnswer.label
	}


	onDestroy(() => {
		// leaveClass();
	});
	
</script>

<style>
	button {

	}
	.feeling-button {
		height: 20vh;
	}
	.modal-background {
		pointer-events: none;
	}
</style>

{#if quizIsActive && signedIn && currentQuiz}
	<div class="modal is-active">
		<div class="modal-background"></div>
		<div class="modal-card">
			<header class="modal-card-head">
				<p class="modal-card-title">Assesment - {currentTopic}</p>
			</header>
			<section class="modal-card-body">
				<div class="content">
					<p>{currentQuiz.question}</p>
				</div>
				<div class="field is-grouped is-grouped-multiline">
					{#each currentQuiz.answers as answer, i}
						<p class="control">
							<button class={currentAnswer && currentAnswer.label === answer.label ? 'button is-light' : 'button'} on:click={() => currentAnswer = answer}>
								{answer.label}
							</button>
						</p>
					{/each}
				</div>
			</section>
			<footer class="modal-card-foot">
				<button class="button is-success" on:click={handleSubmitAnswer}>Submit answer</button>
				<button class="button is-danger" on:click={handleIDK}>I don't know</button>
			</footer>
		</div>
	</div>
{/if}



{#if !signedIn}
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
        <button class="button feeling-button is-large is-dark is-fullwidth is-success" on:click={handleFeeling} value="bored">Bored 😴</button>
      </div>
      <div class="column">
        <button class="button feeling-button is-large is-dark is-fullwidth is-danger" on:click={handleFeeling} value="confused">Confused 😕</button>
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
					<form on:submit|preventDefault={addName}>
						<label class="label">Name</label>
						<input class="input is-large" type="text" placeholder="Name" bind:value={name}>
					</form>
				{/if}
      </div>
    </div>
  {/if}
</div>

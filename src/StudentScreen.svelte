<script>

	import { fade } from 'svelte/transition';
  import { db } from './firebase';
  import { collectionData } from 'rxfire/firestore';
	import { tap } from 'rxjs/operators';
	import { object } from 'rxfire/database';
	import moment from 'moment'
	import { Router, Link, Route } from "svelte-routing";

	import FeedbackSent from './components/FeedbackSent.svelte';

	let name = ''; 
	let signedIn = false;
	let allFeedback = [];

	function addName(name) {
		signedIn = true;
		name = name;

		const feedback = db.collection('feedback').where('name', '==', name);

		collectionData(feedback, 'id')
		// .pipe(
		//   tap(feedback => console.log(feedback))
		// )
		.subscribe(newFeedback => {
			allFeedback = newFeedback
				.sort((a, b) => (a.created < b.created) ? 1 : -1)
				.map(stuff => ({
				...stuff,
				created: moment(stuff.created).fromNow()
			}));
		})
	}

	function handleClick({ target }) {
		db.collection('feedback')
			.add({ 
				name,
				feeling: target.value,
				created: Date.now()
			});
	}
	
</script>

<div class="section">
  <h1 class="title">Bored or Confused</h1>
  <h2 class="subtitle">
    A tool for discreetly giving live feedback to an instructor while they're lecturing. Great for introverts. 
  </h2>

  {#if signedIn}
    <div class="columns">
      <div class="column">
        <button class="button is-large is-fullwidth" on:click={handleClick} value="bored">Bored 😴</button>
      </div>
      <div class="column">
        <button class="button is-large is-fullwidth" on:click={handleClick} value="confused">Confused 😕</button>
      </div>
    </div>
    <hr/>
    {#each allFeedback as item}
      <FeedbackSent item={item}/>
    {/each}
  {:else}
    <div class="field">
      <div class="control">
        <form on:submit|preventDefault={() => { addName(name) }}>
          <input class="input is-large" type="text" placeholder="Name" bind:value={name}>
        </form>
      </div>
    </div>
  {/if}

<!-- <div class="box">
  <article class="media">
    <div class="media-left">
      <figure class="image is-64x64">
        <img src="https://bulma.io/images/placeholders/128x128.png" alt="Image">
      </figure>
    </div>
    <div class="media-content">
      <div class="content">
        <p>
          <strong>John Smith</strong>
        </p>
      </div>
      <nav class="level is-mobile">
        <div class="level-left">
          <h2 class="title is-2">👍</h2>
        </div>
      </nav>
    </div>
  </article>
</div> -->
</div>
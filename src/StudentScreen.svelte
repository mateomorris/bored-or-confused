<script>

	import { fly, fade } from 'svelte/transition';
  import { db } from './firebase';
  import { collectionData } from 'rxfire/firestore';
	import { tap } from 'rxjs/operators';
	import { object } from 'rxfire/database';
	import moment from 'moment'
	import { Router, Link, Route } from "svelte-routing";

	import FeedbackSent from './components/FeedbackSent.svelte';

	let name = ''; 
	let signedIn = false;
	let feedback = [];
  let clearDate = new Date();

	function addName(name) {
		signedIn = true;
		name = name;

		const feedbackFromServer = db.collection('feedback').where('name', '==', name);

		collectionData(feedbackFromServer, 'id')
		// .pipe(
		//   tap(feedback => console.log(feedback))
		// )
		.subscribe(newFeedback => {
			feedback = newFeedback
				.sort((a, b) => (a.created < b.created) ? 1 : -1)
				.map(data => ({
				...data,
      	formattedTime: moment(data.created).fromNow()
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

<div class="section" in:fly="{{ y: -100, duration: 1000 }}">
  <h1 class="title">Bored or Confused</h1>
  <h2 class="subtitle">
    A tool for discreetly giving feedback to an instructor while they're lecturing. Great for introverts. 
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
    {#each feedback as item (item.created)}
		  {#if item.created >= clearDate}
      	<FeedbackSent item={item}/>
    	{/if}
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
</div>
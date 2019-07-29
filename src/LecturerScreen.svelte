<script>
	import { fly, fade } from 'svelte/transition';
  import { db } from './firebase';
  import { collectionData } from 'rxfire/firestore';
	import { tap } from 'rxjs/operators';
	import { object } from 'rxfire/database';
	import moment from 'moment'
	import { Router, Link, Route } from "svelte-routing";

	import FeedbackReceived from './components/FeedbackReceived.svelte';

	let allFeedback = [];
  let clearDate = new Date();

  const feedback = db.collection('feedback');

  collectionData(feedback, 'userId')
  // .pipe(
  //   tap(feedback => console.log(feedback))
  // )
  .subscribe(newFeedback => {
    allFeedback = newFeedback
      .sort((a, b) => (a.created < b.created) ? 1 : -1)
      .map(stuff => ({
      ...stuff,
      formattedTime: moment(stuff.created).fromNow()
    }));
  })
	
</script>

<div class="section" in:fly="{{ y: -100, duration: 1000 }}">
  <section class="hero is-dark">
    <div class="hero-body">
      <div class="container">
        <h1 class="title">
          Live Lecture Feedback
        </h1>
        <h2 class="subtitle">
          Lecturer Dashboard
        </h2>
      </div>
    </div>
  </section>
  <hr/>
  {#each allFeedback as item (item.created)}
    {#if item.created >= clearDate}
      <FeedbackReceived item={item} key={item.created}/>
    {/if}
  {/each}

</div>
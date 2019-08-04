<!-- src/routes/blog/[slug].svelte -->
<script context="module">
	// the (optional) preload function takes a
	// `{ path, params, query }` object and turns it into
	// the data we need to render the page
	export async function preload(page, session) {
		// the `slug` parameter is available because this file
		// is called [slug].svelte
		const { slug } = page.params;

    let classId = slug;

		// `this.fetch` is a wrapper around `fetch` that allows
		// you to make credentialled requests on both
		// server and client
		const res = await this.fetch(`blog/${slug}.json`);
		const article = await res.json();

		return { classId };
	}
</script>

<svelte:head>
  <title>BoC - Instructor</title>
</svelte:head>

<script>
	export let classId;

	import { onMount } from 'svelte';
  import { fly, fade } from 'svelte/transition';
  import { db } from '../../../firebase';
  import { collectionData } from 'rxfire/firestore';
	import { tap } from 'rxjs/operators';
	import { object } from 'rxfire/database';
	import moment from 'moment';

  import { showClassIdPopop } from '../../../components/classIdPopup'
	import FeedbackReceived from '../../../components/FeedbackReceived.svelte';

	import ShortUniqueId from 'short-unique-id';
	let uid = new ShortUniqueId();

  onMount(() => {

    const instructorsClass = db.collection('classes').doc(classId);

    instructorsClass.onSnapshot(function(doc) {
      let data = doc.data();
      nStudents = data.students.length;
      allFeedback = data.feedback
        .sort((a, b) => (a.created < b.created) ? 1 : -1)
        .map(stuff => ({
        ...stuff,
        formattedTime: moment(stuff.created).fromNow()
      }));
    });
  }) 

	let allFeedback = [];
  let clearDate = 0;
  let nStudents = 0;

	
</script>

<style>
  .class-id {
    text-align: right;
  }
</style>

<div class="container" in:fly="{{ y: -50, duration: 500 }}">
  <section class="hero is-dark">
    <div class="hero-body">
      <div class="container">
        <div class="columns">
          <div class="column">
            <h1 class="title">
              Bored or Confused
            </h1>
            <h2 class="subtitle">
              Instructor Dashboard
            </h2>
            <h2 class="subtitle">
              { nStudents } student{ nStudents === 1 ? '' : 's'}
            </h2>
          </div>
          <div class="column class-id" on:click={() => { showClassIdPopop(classId) }}>
            <button class="button is-large">Class ID:<strong>{classId}</strong></button>
          </div>
        </div>
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
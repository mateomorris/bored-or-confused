<svelte:head>
  <title>BoC - Instructor</title>
</svelte:head>

<script>
	import { onMount } from 'svelte';
  import { fly, fade } from 'svelte/transition';
  import { db } from '../../firebase';
  import { collectionData } from 'rxfire/firestore';
	import { tap } from 'rxjs/operators';
	import { object } from 'rxfire/database';
	import moment from 'moment';
  import * as sapper from '@sapper/app';


  import { showClassIdPopop } from '../../components/classIdPopup'
	import FeedbackReceived from '../../components/FeedbackReceived.svelte';

	import ShortUniqueId from 'short-unique-id';
	let uid = new ShortUniqueId();

	let classId = uid.randomUUID(4).toLowerCase();

  onMount(() => {
    db.collection('classes')
    .doc(classId)
    .set({ 
      feedback: [],
      students: []
    });

    const instructorsClass = db.collection('classes').doc(classId);

    instructorsClass.onSnapshot(function(doc) {
      let data = doc.data();
      console.log(data);
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
  let clearDate = new Date();
  let nStudents = 0;

  let existingClassId = '';

  let joiningExistingClass = false;
	
</script>

<style>
	.button {
		height: 25vh;
	}
</style>

<div class="container">
	<h1 class="title">Bored or Confused - Instructor</h1>
  <div class="columns">
    <div class="column">
      <button class="button is-large is-dark is-fullwidth" on:click={() => joiningExistingClass = true} value="bored">Join existing class</button>
      {#if joiningExistingClass }
        <br />
				<form on:submit|preventDefault={() => { sapper.goto(`/instructor/dashboard/${existingClassId}`) }}>
          <div class="field is-horizontal" in:fly>
            <div class="field-label is-normal">
              <label class="label">Class ID</label>
            </div>
            <div class="field-body">
              <div class="field">
                <p class="control">
                  <input class="input" type="text" placeholder="an1x" bind:value={existingClassId} maxlength="4" />
                </p>
              </div>
            </div>
          </div>
        </form>
      {/if}
    </div>
    <div class="column">
      <a class="button is-large is-dark is-fullwidth" href="/instructor/dashboard" value="confused">Create new class</a>
    </div>
  </div>
</div>


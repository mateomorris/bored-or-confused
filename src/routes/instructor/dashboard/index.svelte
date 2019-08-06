<svelte:head>
  <title>BoC - Instructor</title>
</svelte:head>

<script>
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
      nStudents = data.students.length;
      students = data.students;
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

  let students = [];
  $: nStudents = students.length;
  $: nStudentsLabel = `${ nStudents } student${ nStudents === 1 ? '' : 's'}`

  let studentNavVisible = false

  function showStudentNav() {
    studentNavVisible = true
  }

	
</script>

<style>
  .site-logo {
    font-weight: 800;
  }
  .site-logo > span {
    font-weight: 400;
  }
</style>


<nav class="navbar" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <a class="navbar-item site-logo title is-4" href="https://bulma.io">BoC <span>: Instructor Dashboard</span></a>
  </div>

  <div id="navbarBasicExample" class="navbar-menu">

    <div class="navbar-end">
      <div class="navbar-item has-dropdown is-hoverable">
        <a class="navbar-link">{nStudentsLabel}</a>

        <div class="navbar-dropdown">
          {#each students as student}
            <span class="navbar-item">{student}</span>
          {/each}
          <!-- <hr class="navbar-divider">
          <div class="navbar-item">
            <button class="button is-dark" on:click={() => { showClassIdPopop(classId) }}>
              <strong>Class: {classId}</strong>
            </button>
          </div> -->
        </div>
      </div>
      <div class="navbar-item">
        <div class="buttons">
          <button class="button is-light" on:click={() => { showClassIdPopop(classId) }}>
            <strong>Class: {classId}</strong>
          </button>
        </div>
      </div>
    </div>
  </div>
</nav>
<div class="container" in:fly="{{ y: -50, duration: 500 }}">
  <hr/>
  {#each allFeedback as item (item.created)}
    {#if item.created >= clearDate}
      <FeedbackReceived item={item} key={item.created}/>
    {/if}
  {/each}
</div>
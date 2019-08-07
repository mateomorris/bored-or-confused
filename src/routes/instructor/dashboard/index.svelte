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
	// let classId = 'cv2r';

  const currentClass = db.collection('classes')
    .doc(classId);

  onMount(() => {

    currentClass
    .set({ 
      feedback: [],
      students: [],
      topics: [],
      activeTopic: currentTopic
    });

    currentClass.onSnapshot(function(doc) {
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
  $: classEmpty = students.length < 1 ? true : false
  $: nStudentsLabel = `${ nStudents } student${ nStudents === 1 ? '' : 's'}`

  let studentNavVisible = false

  function showStudentNav() {
    studentNavVisible = true
  }

  let editingTopicHeading = true;

  let currentTopicIndex = 0;
  let topics = [''];
  let typedTopic = topics[currentTopicIndex];
  $: currentTopic = topics[currentTopicIndex]
  $: nextTopic = topics[currentTopicIndex + 1]
  
  let topicsActive = false

  function editTopic() {
    editingTopicHeading = false
    topics = topics.map(topic => topic == '' ? typedTopic : topic)

		currentClass.update({ 
      topics,
      activeTopic: topics[currentTopicIndex]
     });
  }

  function addTopic() {
    editingTopicHeading = true
    typedTopic = '';
    topics = [ ...topics, '' ]
    currentTopicIndex = topics.length - 1
    console.log(topicInput)
    if (topicInput) {
    topicInput.focus()
    // TODO: Get this to work
    }
  }

  function changeToTopic(index, goBack = false) {
    console.log(currentTopicIndex, index)
    currentTopicIndex = index;
		currentClass.update({ 
      activeTopic: topics[index]
     });
  }

	function handleKeydown({key}) {

    if (key === 'Enter' && (currentTopicIndex === topics.length - 1) & !editingTopicHeading) {
      addTopic()
    } if ((key === ' ' || key === 'ArrowRight') && currentTopicIndex != (topics.length -1)) {
      changeToTopic(currentTopicIndex + 1)
    } else if (key === 'ArrowLeft' && currentTopicIndex != 0) {
      console.log(currentTopicIndex)
      changeToTopic(currentTopicIndex - 1)
    }
	}

  let topicInput;

	
</script>

<style>
  .site-logo {
    font-weight: 800;
  }
  .site-logo > span {
    font-weight: 400;
  }
  .main-content {
    overflow: scroll;
  }
</style>

<svelte:window on:keydown={handleKeydown}/>

<nav class="navbar is-dark" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <a class="navbar-item site-logo title is-4" href="https://boredorconfused.com">BoC <span>: Instructor Dashboard</span></a>
  </div>

  <div id="navbarBasicExample" class="navbar-menu">

    <div class="navbar-end">
      <div class="navbar-item {!classEmpty && 'has-dropdown is-hoverable'}">
        <a class="navbar-link {classEmpty && 'is-arrowless'}">{nStudentsLabel}</a>
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
  <div class="columns">
    <div class="column main-content">
      {#if topics.length > 1 }
        <div class="tabs" in:fly>
          <ul>
            {#each topics as topic, index}
              {#if currentTopicIndex === index }
                <li class="is-active"><a>{topic}</a></li>
              {:else}
                <li><a on:click={() => { changeToTopic(index) }}>{topic}</a></li>
              {/if}
            {/each}
          </ul>
        </div>
      {/if}
      <div class="card" in:fade>
        <div class="card-content">
          {#if topicsActive}
            {#if editingTopicHeading}
              <form on:submit={editTopic}>
                <input class="input is-large" type="text" placeholder="Topic" bind:value={typedTopic} bind:this={topicInput}>
              </form>
            {:else}
              <p class="title" on:click={() => { editingTopicHeading = true }}>{currentTopic}</p>
            {/if}
          {:else}
            <button class="button is-primary is-medium is-fullwidth" on:click={() => { topicsActive = true }}>Add a topic</button>
          {/if}
        </div>
        <!-- <footer class="card-footer">
          <p class="card-footer-item">
            <span>
              <a href="https://twitter.com/codinghorror/status/506010907021828096">Edit</a>
            </span>
          </p>
          <p class="card-footer-item">
            <span>
              <a href="#">Quiz</a>
            </span>
          </p>
        </footer> -->
      </div>
      <br>
      {#each allFeedback as item (item.created)}
        {#if (item.created >= clearDate) && (item.topic === currentTopic)}
          <FeedbackReceived item={item} key={item.created}/>
        {/if}
      {/each}
    </div>
    {#if topicsActive }
      <div class="column is-one-fifth">
        <div class="card">
          <header class="card-header">
            <p class="card-header-title">
            {#if (currentTopicIndex >= 2) && (topics.length -1 <= currentTopicIndex)}
                End of Lesson
            {:else}
                Next Topic
            {/if}
            </p>
          </header>
          <div class="card-content">
            <button class="button is-primary is-fullwidth" on:click={addTopic}>Add Topic</button>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>
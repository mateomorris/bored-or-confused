<svelte:head>
  <title>BoC - Instructor</title>
</svelte:head>

<script>
	import ShortUniqueId from 'short-unique-id';
  import * as sapper from '@sapper/app';

  export let existingClassId;

  const uid = new ShortUniqueId();  
  const uniqueId = uid.randomUUID(4).toLowerCase();

  if (!existingClassId) {
    sapper.goto(`/instructor/dashboard/${uniqueId}`)
  } 

	import { onMount } from 'svelte';
  import { fly, fade } from 'svelte/transition';
  import { db } from '../../../firebase';
  import { collectionData } from 'rxfire/firestore';
	import { tap } from 'rxjs/operators';
	import { object } from 'rxfire/database';
	import moment from 'moment';

  import TopNav from './_wrapper.svelte'

  import { showClassIdPopop } from '../../../components/classIdPopup'
	import FeedbackReceived from '../../../components/FeedbackReceived.svelte';

  console.log(existingClassId)
	let classId = existingClassId || uniqueId;
  console.log(classId)
	// let classId = 'cv2r';

  const currentClass = db.collection('classes')
    .doc(classId);

  let exampleVariable;

	let allFeedback = [];
  let clearDate = new Date();

  let students = [];

  let editingTopicHeading = false;

  let currentTopicIndex = 0;
  let topics = [''];
  let typedTopic = topics[currentTopicIndex];
  $: currentTopic = topics[currentTopicIndex]
  $: nextTopic = topics[currentTopicIndex + 1]
  
  let topicsActive = false

  onMount(() => {

    currentClass
    .get().then((doc) => {
      let data = doc.data();
      console.log(doc)
      console.log(data)
      if (data) { // Already exists
        console.log('ANDHERE')
        let { students, feedback, topics } = data;
        let dataEmpty = [ ...students, ...feedback, ...topics].length > 0 ? false : true;
        if (!dataEmpty) { // Already has data, populate local data
          topicsActive = data.topics.length > 1 ? true : false
          console.log(data)
          currentTopicIndex = data.topics.indexOf(data.activeTopic)
          students = data.students
          topics = data.topics
          allFeedback = data.feedback
            .sort((a, b) => (a.created < b.created) ? 1 : -1)
            .map(stuff => ({
            ...stuff,
            formattedTime: moment(stuff.created).fromNow()
          }));
        }
      } else { // Doesn't exist yet
        console.warn('Doesnt exist yet')
        currentClass.set({ 
          feedback: [],
          students: [],
          topics: [''],
          activeTopic: ''
        })
      }
    });

    currentClass.onSnapshot(function(doc) {
      let data = doc.data();
      console.log(data)
      if (data) {
        currentTopicIndex = data.topics.indexOf(data.activeTopic);
        topics = data.topics;
        students = data.students;
        allFeedback = data.feedback
          .sort((a, b) => (a.created < b.created) ? 1 : -1)
          .map(stuff => ({
          ...stuff,
          formattedTime: moment(stuff.created).fromNow()
        }));
      }
    });
  }) 

  function editTopic() {
    editingTopicHeading = false
    topics = topics.map(topic => topic == '' ? typedTopic : topic)

    console.log(topics)

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

<TopNav 
  students={students}
  classId={classId}
/>

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
            <button class="button is-primary is-medium is-fullwidth" on:click={() => { topicsActive = true; editingTopicHeading = true; }}>Add a topic</button>
          {/if}
        </div>
      </div>
      <br>
      {#each allFeedback as item (item.created)}
        <!-- {#if (item.created >= clearDate) && (item.topic === currentTopic)} -->
        {#if (item.topic === currentTopic)}
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
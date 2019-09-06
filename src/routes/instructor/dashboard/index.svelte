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
  import Tabs from './_Tabs.svelte'

  import Modal from './_modal.svelte'
  import StudentFeedback from './_StudentFeedback.svelte'
  import SideNav from './_SideNav.svelte'

  import { showClassIdPopop } from '../../../components/classIdPopup'
	import FeedbackReceived from '../../../components/FeedbackReceived.svelte';
  import TopicCard from './_TopicCard.svelte'


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
  let topics = [];
  let typedTopic = topics[currentTopicIndex];
  $: currentTopic = topics[currentTopicIndex]
  $: nextTopic = topics[currentTopicIndex + 1]
  
  let topicsActive = false


  class Quiz { 
    constructor() {
      this.question = '';
      this.answers = [];
    }
  }



  onMount(() => {

    currentClass
    .get().then((doc) => {
      let data = doc.data();
      if (data) { // Already exists
        let { students, feedback, topics } = data;
        let dataEmpty = [ ...students, ...feedback, ...topics].length > 0 ? false : true;
        if (!dataEmpty) { // Already has data, populate local data
          topicsActive = data.topics.length > 0 ? true : false
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
        currentClass.set({ 
          feedback: [],
          students: [],
          topics: [],
          questions: [],
          activeTopic: '',
          quizActive: false
        })
      }
    });

    currentClass.onSnapshot(function(doc) {
      let data = doc.data();
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
        allQuizes = data.quizzes;
        allResponses = data.quizResponses;
        allQuestions = data.questions;
      }
    });
  }) 

  function editTopic(updatedTopic) {
    editingTopicHeading = false
    topics = topics.map(topic => topic === '' ? updatedTopic : topic)

		currentClass.update({ 
      topics,
      activeTopic: topics[currentTopicIndex]
     });
  }

  function addTopic() {
    topicsActive = true;
    editingTopicHeading = true
    typedTopic = '';
    topics = [ ...topics, '' ]
    currentTopicIndex = topics.length - 1
  }

  function changeToTopic(index) {
    currentTopicIndex = index;
		currentClass.update({ 
      activeTopic: topics[index],
      quizActive: false
     });
  }

  function removeTopic() {
    let i = currentTopicIndex;
    topics = topics.slice(0, i).concat(topics.slice(i + 1, topics.length));

		currentClass.update({ 
      topics,
      activeTopic: topics[currentTopicIndex],
      quizActive: false
     });
  }

  function updateTopicOrder(newTopics) {
    topics = newTopics;
		currentClass.update({ 
      topics
     });
  }

	function handleKeydown({key}) {

    if (!creatingQuiz) {
      if (key === 'Enter' && (currentTopicIndex === topics.length - 1) & !editingTopicHeading) {
        addTopic()
      } if ((key === ' ' || key === 'ArrowRight') && currentTopicIndex != (topics.length -1)) {
        changeToTopic(currentTopicIndex + 1)
      } else if (key === 'ArrowLeft' && currentTopicIndex != 0) {
        console.log(currentTopicIndex)
        changeToTopic(currentTopicIndex - 1)
      }
    } 
	}

  let topicInput;


  let topicBeingDragged;
  let indexOfTopicBeingDragged;
  let indexOfTopicBeingHovered;

  function handleDragEnd() {
    let updatedTopics = topics.filter((i,key) => key != indexOfTopicBeingDragged) 
    updatedTopics.splice(indexOfTopicBeingHovered, 0, topicBeingDragged);
    updateTopicOrder(updatedTopics)

    currentTopicIndex = indexOfTopicBeingHovered
    indexOfTopicBeingDragged = null;
    indexOfTopicBeingHovered = null;
  }

  function handleDragEnter({detail}) {
    let topicBeingHovered = detail.path[0]['text']
    indexOfTopicBeingHovered = topics.indexOf(topicBeingHovered)
  }

  let currentQuiz = new Quiz();
  $: console.log(currentQuiz)

  let creatingQuiz;

  let quiz = {
    question: '',
    options: [
      {
        label: '',
        isAnswer: false
      }
    ],
  }

  function createNewQuiz() {
    creatingQuiz = true;
  }

  let allQuizes = [];
  let allResponses = [];
  $: responsesToCurrentTopic = allResponses ? allResponses.filter(r => r.topic === currentTopic) : []

  let answers = [];
  let addingAnswer = false;
  let currentAnswer = {
    label : '',
    correct: false,
  };
  $: currentTopicQuiz = allQuizes ? allQuizes.filter(q => q.topic === currentTopic)[0] : null;
  $: currentTopicHasQuiz = currentTopicQuiz ? true : false;

  function startAddingAnswer() {
    addingAnswer = true;
  }

  function addAnswer() {
    currentQuiz.answers = [
      currentAnswer,
      ...answers
    ]
    answers = [
      currentAnswer,
      ...answers
    ]
    addingAnswer = false;
    currentAnswer = {
      label : '',
      correct: false,
    };
  }


  $: sendQuizDisabled = ((nAnswers, question) => nAnswers && question.length ? false : true)(answers.length, currentQuiz.question);
  function saveQuiz() {
    allQuizes = allQuizes ? [
      {
        topic: currentTopic,
        question: currentQuiz.question,
        answers
      },
      ...allQuizes 
    ] : [
      {
        topic: currentTopic,
        question: currentQuiz.question,
        answers
      }
    ];

    answers = [];

    currentQuiz = new Quiz();

    currentClass.update({ 
      quizzes: allQuizes
    });

    creatingQuiz = false;
  }

  function sendQuiz() {

    currentClass.update({ 
      quizActive: true
    });
  }


  let allQuestions = [];

  $: questionsAndFeedback = [...allQuestions, ...allFeedback].sort((a, b) => (a.created < b.created) ? 1 : -1)


  $: modalProps = {
    currentQuiz,
    addingAnswer,
    currentAnswer,
    sendQuizDisabled,
    startAddingAnswer,
    saveQuiz,
    answers,
    addAnswer
  }

  $: tabProps = {
    topics,
    currentTopicIndex
  }
	
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

{#if creatingQuiz }
  <Modal 
    {...modalProps}
    on:modalClose={() => creatingQuiz = false}
  />
{/if}

<TopNav 
  students={students}
  classId={classId}
/>

<div class="container" in:fly="{{ y: -50, duration: 500 }}">
  <hr/>
  <div class="columns">
    <div class="column main-content">
      {#if topics.length > 0 }
        <Tabs
          {...tabProps}
          on:topicChange={({detail}) => changeToTopic(detail)}
          on:updateTopicOrder={({detail}) => {updateTopicOrder(detail)}}
        />
      {/if}
      <TopicCard 
        topic={currentTopic}
        quiz={currentTopicQuiz}
        responses={responsesToCurrentTopic}
        editing={editingTopicHeading}
        allowRemove={topicsActive && !editingTopicHeading}
        showTopics={topicsActive}
        on:removeTopic={removeTopic}
        on:sendQuiz={sendQuiz}
        on:addTopic={addTopic}
        on:editTopic={({detail}) => editTopic(detail)}
      />
      <hr>
      {#each questionsAndFeedback as item}
        {#if item.feeling}
          <FeedbackReceived item={item} key={item.created}/>
        {:else}
         <div class="card" in:fade>
          <div class="card-content">
            <p class="title is-4">{item.question}</p>
            <p class="subtitle is-5">{item.name} ({moment(item.created).fromNow()})</p>
          </div>
         </div>
         <br>
        {/if}
      {/each}
      <!-- <div class="card" in:fade>
        {#if topicsActive && !editingTopicHeading}
          <button class="delete" on:click={removeTopic} in:fade></button>
        {/if}
        <div class="card-content">
          {#if topicsActive}
            {#if editingTopicHeading}
              <form on:submit|preventDefault={editTopic}>
                <input class="input is-large" type="text" placeholder="Topic" bind:value={typedTopic} bind:this={topicInput}>
              </form>
            {:else}
              <p class="title" on:click={() => { editingTopicHeading = true }}>{currentTopic}</p>
              {#if currentTopicHasQuiz}
                <hr>
                <div class="content">
                  <p><strong>{currentTopicQuiz.question}</strong></p>
                  <ul>
                    {#each currentTopicQuiz.answers as answer}
                      <li>{answer.label} {#if answer.correct}✅{/if}</li>
                    {/each}
                  </ul>
                  <button class="button is-link is-medium" on:click={sendQuiz}>Send Quiz</button>
                </div>
                {#each responsesToCurrentTopic as response}
                  <h1>{response.name}
                    {#if response.correct}✅{:else if !response.answer}‍‍‍🤷‍{:else}- {response.answer}{/if}</h1>
                {/each}
              {/if}
            {/if}
          {:else}
            <button class="button is-primary is-medium is-fullwidth" on:click={() => { topicsActive = true; editingTopicHeading = true; }}>Add a topic</button>
          {/if}
        </div>
      </div> -->
    </div>
    {#if topicsActive }
      <div class="column is-one-fifth">
        <SideNav 
          endOfLesson={(currentTopicIndex >= 2) && (topics.length -1 <= currentTopicIndex)}
          canAddQuiz={currentTopicHasQuiz}
          on:addQuiz={createNewQuiz}
          on:addTopic={addTopic}
        />
      </div>
    {/if}
  </div>
</div>
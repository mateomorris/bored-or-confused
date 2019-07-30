<script>
	import { fly, fade } from 'svelte/transition';
  import { db } from './firebase';
  import { collectionData } from 'rxfire/firestore';
	import { tap } from 'rxjs/operators';
	import { object } from 'rxfire/database';
	import moment from 'moment';

	import FeedbackReceived from './components/FeedbackReceived.svelte';

	import ShortUniqueId from 'short-unique-id';
	let uid = new ShortUniqueId();

	let classId = uid.randomUUID(4).toLowerCase();

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

	let allFeedback = [];
  let clearDate = new Date();
  let nStudents = 0;


  function showClassIdPopop() {
    var win = window.open("", "BoC - Class ID", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=yes,width=200,height=50,top="+(screen.height-400)+",left="+(screen.width-840));
    win.document.body.innerHTML = `
      <style>
        body {
          margin: 0;
        }
        #container {
          background-color:rgb(47,47,47);
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          height: 100vh;
        }

        #container > h1 {
          font-family:sans-serif;
          color:white;
          text-align:center;
          font-size: 10vw;
          margin-bottom: 0;
        }

        #container > h2 {
          font-family:sans-serif;
          color:white;
          text-align:center;
          font-size: 5vw;
          margin-top: 0.25rem;
          font-weight: 400;
        }

        #container span {
          text-decoration: underline;
        }
      </style>
      <div id="container">
        <h1>
          Class ID: <span>${classId}</span>
        </h1>
        <h2>
          boredorconfused.com
        </h2>
      </div>
    `;
  }
	
</script>

<style>
  .class-id {
    text-align: right;
  }
  .class-id > strong {
    text-decoration: underline;
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
          <div class="column class-id" on:click={() => { showClassIdPopop() }}>
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
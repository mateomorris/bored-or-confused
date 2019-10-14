<script>
	import { fade, fly, draw } from 'svelte/transition';
  import Illustration from '../components/Illustration.svelte';

  let studentHover = false;
  let instructorHover = false;

</script>

<svelte:head>
  <title>Bored or Confused</title>
</svelte:head>

<style>
	.button {
		height: 20vh;
    position: relative;
	}

  #student-button {
    background-image: url('static/student.svg');
  }

  #instructor-button {
    background-image: url('static/teacher.svg');
  }

  .illustration {
    text-align: center;
  }

</style>

<h1 class="title">Bored or Confused</h1>
<h2 class="subtitle">
  A tool for getting questions and feedback from students while lecturing. Great for introverts.
</h2>
<div class="illustration">
  <Illustration {studentHover} {instructorHover}/>
</div>
<div class="columns">
  <div class="column">
    <a 
      class="button is-large is-fullwidth is-info"
      id="student-button" 
      href="/student" 
      on:mouseover={() => studentHover = true} 
      on:mouseout={() => studentHover = false}>
        <span in:fade="{{ duration: 500 }}">Student</span>
    </a>
  </div>
  <div class="column">
    <a 
      class="button is-large is-fullwidth is-success instructor" 
      id="instructor-button" 
      href="/instructor"  
      on:mouseover={() => instructorHover = true} 
      on:mouseout={() => instructorHover = false}>
        <span in:fade="{{ duration: 500 }}">Instructor</span>
    </a>
  </div>
</div>

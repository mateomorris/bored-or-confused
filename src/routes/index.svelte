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

  .button > img {
    position: absolute;
    width: 50%;
    pointer-events: none;
  }

  #student-button {
    background-image: url('static/student.svg');
  }

  #student-button > img {
    position: absolute;
    width: 50%;
  }

  #instructor-button {
    background-image: url('static/teacher.svg');
  }

  .illustration {
    text-align: center;
  }

  .illustration > svg {
    height: 35vh;
    margin-top: 5rem;
    margin-bottom: 5rem;
  }
</style>

<h1 class="title">Bored or Confused</h1>
<h2 class="subtitle">
  A tool for discreetly giving feedback to an instructor while they're lecturing. Great for introverts.
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
      {#if studentHover}
        <img alt='' src='student.svg' in:fade="{{ duration: 500 }}">
      {:else}
        <span in:fade="{{ duration: 500 }}">Student</span>
      {/if}
    </a>
  </div>
  <div class="column">
    <a 
      class="button is-large is-fullwidth is-success instructor" 
      id="instructor-button" 
      href="/instructor"  
      on:mouseover={() => instructorHover = true} 
      on:mouseout={() => instructorHover = false}>
      {#if instructorHover}
        <img alt='' src='teacher.svg' in:fade="{{ duration: 500 }}" >
      {:else}
        <span in:fade="{{ duration: 500 }}">Instructor</span>
      {/if}
    </a>
  </div>
</div>

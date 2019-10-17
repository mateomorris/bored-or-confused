<script>
  import { fly, fade } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();


  export let endOfLesson;
  export let canAddQuiz;

</script>

<div class="card">
  <header class="card-header">
    <p class="card-header-title">
      {#if endOfLesson}
          End of Lesson
      {:else}
          Next Topic
      {/if}
    </p>
  </header>
  <div class="card-content">
    <div class="buttons">
      <button class="button is-primary is-fullwidth" on:click={() => dispatch('addTopic')} id="add-topic">Add Topic</button>
      <button class="button is-link is-fullwidth" on:click={() => dispatch('addQuiz')}>Add Quiz</button>
    </div>
  </div>
</div>
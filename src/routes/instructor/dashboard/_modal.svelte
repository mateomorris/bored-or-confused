<script>
  import { fly, fade } from 'svelte/transition';

  export let currentQuiz;
  export let addingAnswer;

  export let addAnswer;

  export let currentAnswer;

  export let sendQuizDisabled;
  export let startAddingAnswer

  export let saveQuiz

  export let answers;



</script>	
  
  
<div class="modal is-active" in:fade={{ duration: 250 }}>
  <div class="modal-background"></div>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Second Topic - Quiz</p>
    </header>
    <section class="modal-card-body">
      <div class="field">
        <label class="label">Question</label>
        <div class="control">
          <input class="input" type="text" placeholder="Quiz question" bind:value={currentQuiz.question}>
        </div>
      </div>
      <div class="field is-grouped is-grouped-multiline">
        {#if addingAnswer}
          <div class="control">
            <label class="checkbox">
              <form on:submit|preventDefault={addAnswer}>
                <input class="input" type="text" placeholder="Answer" bind:value={currentAnswer.label}>
                <input type="checkbox" id="correct" bind:checked={currentAnswer.correct}>
                <label for="correct">Correct answer</label>
              </form>
            </label>
          </div>
        {:else}
          <p class="control">
            <a class="button is-light" on:click={startAddingAnswer}>
              Add an answer
            </a>
          </p>
        {/if}
      </div>
      <div class="content is-medium">
        <ul>
          {#each answers as answer}
            <li>
              {answer.label}
              {#if answer.correct}✅{/if}
            </li>
          {/each}
        </ul>
      </div>
    </section>
    <footer class="modal-card-foot">
      <button class="button is-dark" disabled={sendQuizDisabled} on:click={saveQuiz}>Save quiz</button>
    </footer>
  </div>
</div>
<script>
  import { fade } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

  export let topic;
  export let quiz;
  export let responses;
  export let allowRemove;
  export let showTopics;

  export let editing;

  let editingTopicHeading = false;
  let typedTopic = '';

</script>

<style>
  .delete {
    right: 0.5rem;
    position: absolute;
    top: 0.5rem;
  }
</style>


<div class="card" in:fade>
  {#if allowRemove}
    <button class="delete" on:click={() => dispatch('removeTopic')} in:fade></button>
  {/if}
  <div class="card-content">
    {#if showTopics}
      {#if editing}
        <form on:submit|preventDefault={() => {dispatch('editTopic', typedTopic); typedTopic = '';}}>
          <div class="field has-addons">
            <div class="control is-expanded">
              <input class="input is-large" type="text" placeholder="Topic" bind:value={typedTopic} id="topic" autofocus>
            </div>
            <div class="control">
              <button class="button is-link is-large"  type="submit" id="submit-topic">
                Submit
              </button>
            </div>
          </div>
        </form>
      {:else}
        <p class="title" on:click={() => { editingTopicHeading = true }}>{topic}</p>
        {#if quiz}
          <hr>
          <div class="content">
            <p><strong>{quiz.question}</strong></p>
            <ul>
              {#each quiz.answers as answer}
                <li>{answer.label} {#if answer.correct}✅{/if}</li>
              {/each}
            </ul>
            <button class="button is-link is-medium" on:click={() => dispatch('sendQuiz')}>Send Quiz</button>
          </div>
          {#each responses as response}
            <h1>{response.name}
              {#if response.correct}✅{:else if !response.answer}‍‍‍🤷‍{:else}- {response.answer}{/if}</h1>
          {/each}
        {/if}
      {/if}
    {:else}
      <button class="button is-primary is-medium is-fullwidth" on:click={() => {editingTopicHeading = true; dispatch('addTopic')}} id="add-topic">Add a topic</button>
    {/if}
  </div>
</div>
<script>
	import FeedbackReceived from '../../../components/FeedbackReceived.svelte';

  export let allFeedback;
  export let currentTopic;
</script>

{#each allFeedback as item (item.created)}
  <!-- {#if (item.created >= clearDate) && (item.topic === currentTopic)} -->
  {#if (item.topic === currentTopic)}
    <FeedbackReceived item={item} key={item.created}/>
  {/if}
{/each}
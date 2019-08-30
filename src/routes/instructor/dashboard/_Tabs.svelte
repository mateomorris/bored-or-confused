<script>
  import { createEventDispatcher } from 'svelte';
  import { fly, fade } from 'svelte/transition';
	const dispatch = createEventDispatcher();

  export let topics;
  export let currentTopicIndex;
  
  let indexOfTopicBeingDragged;
  let indexOfTopicBeingHovered;

  let topicBeingDragged;

  function handleDragStart(e) {
    topicBeingDragged = e.path[0]['text']
    indexOfTopicBeingDragged = topics.indexOf(topicBeingDragged)
  }

  function handleDragEnter(e) {
    let topicBeingHovered = e.path[0]['text']
    indexOfTopicBeingHovered = topics.indexOf(topicBeingHovered)
  }

  function handleDragEnd() {
    let updatedTopics = topics.filter((i,key) => key != indexOfTopicBeingDragged) 
    updatedTopics.splice(indexOfTopicBeingHovered, 0, topicBeingDragged);

    dispatch('updateTopicOrder', updatedTopics);

    currentTopicIndex = indexOfTopicBeingHovered
    indexOfTopicBeingDragged = null;
    indexOfTopicBeingHovered = null;
  }

 function getTabClasses(index, indexOfTopicBeingHovered, indexOfTopicBeingDragged) {
    if (index === indexOfTopicBeingDragged) {
      return 'dragging'
    } else if (indexOfTopicBeingHovered === index) {
      if (indexOfTopicBeingHovered < indexOfTopicBeingDragged) {
        return 'will-insert-left'
      } else if (indexOfTopicBeingHovered > indexOfTopicBeingDragged) {
        return 'will-insert-right'
      } 
    } else {
      return ''
    }
  }

</script>

<div class="tabs" in:fly>
  <ul>
    {#each topics as topic, index}
      <li class={currentTopicIndex === index && 'is-active'}>
        <a 
          on:click={e => dispatch('topicChange', index)} 
          draggable="true" 
          on:dragstart={handleDragStart}
          on:dragend={handleDragEnd}
          on:dragenter={handleDragEnter}
          class={`${getTabClasses(index, indexOfTopicBeingHovered, indexOfTopicBeingDragged)} tab-item`}
          >
            {topic}
          </a>
      </li>
    {/each}
  </ul>
</div>
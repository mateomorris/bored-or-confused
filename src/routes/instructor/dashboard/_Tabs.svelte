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

  let tabs = [];

  function scrollIntoView(node) {

    if (node.className === 'is-active') {
      node.scrollIntoView({ behavior: 'smooth', inline: 'start' });
    }

    return {
      delay: 0
    }
  }

	function handleKeydown({key}) {
    if (key === ' ' || key === 'ArrowLeft' || key === 'ArrowRight') {
      let activeTab = [...tabs.children].find(tab => tab.className === 'is-active');
      activeTab.scrollIntoView();
    }
	}

</script>

<style>
  .will-insert-left {
    border-left: 1px solid gainsboro;
    margin-left: -1px;
  }
  .will-insert-right {
    border-right: 1px solid gainsboro;
    margin-right: -1px;
  }
  .tab-item.dragging {
    background-color: whitesmoke;
    transition: 0.25s background-color;
    will-change: transition;
  }
</style>

<svelte:window on:keydown={handleKeydown}/>

<div class="tabs" in:fly>
  <ul bind:this={tabs}>
    {#each topics as topic, index}
      <li class={currentTopicIndex === index ? 'is-active' : ''} in:scrollIntoView>
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
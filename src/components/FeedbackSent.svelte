<script>
  import { fade } from 'svelte/transition';

  export let label;
</script>

<div class="box" transition:fade="{{ duration: 250 }}">
  <article class="media">
    <div class="media-content">
      <nav class="level is-mobile">
        <div class="level-left">
          <div class="content">
            <p>
              {@html label}
            </p>
          </div>
        </div>
      </nav>
    </div>
  </article>
</div>
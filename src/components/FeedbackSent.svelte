<script>
  import { fade } from 'svelte/transition';

  export let item;
</script>

<div class="box" in:fade>
  <article class="media">
    <div class="media-content">
      <nav class="level is-mobile">
        <div class="level-left">
          <div class="content">
            <p>
              <strong>Feedback sent</strong> {item.formattedTime}
            </p>
          </div>
        </div>
      </nav>
    </div>
  </article>
</div>
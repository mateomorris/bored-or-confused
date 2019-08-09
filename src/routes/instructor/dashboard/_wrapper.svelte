<script>
  import { showClassIdPopop } from '../../../components/classIdPopup'

  export let classId;
  export let students;
  $: nStudents = students.length;
  $: nStudentsLabel = `${ nStudents } student${ nStudents === 1 ? '' : 's'}`
  $: classEmpty = students.length < 1 ? true : false



</script>


<nav class="navbar is-dark" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <a class="navbar-item site-logo title is-4" href="https://boredorconfused.com">BoC <span>: Instructor Dashboard</span></a>
  </div>

  <div id="navbarBasicExample" class="navbar-menu">

    <div class="navbar-end">
      <div class="navbar-item {!classEmpty && 'has-dropdown is-hoverable'}">
        <a class="navbar-link {classEmpty && 'is-arrowless'}">{nStudentsLabel}</a>
        <div class="navbar-dropdown">
          {#each students as student}
            <span class="navbar-item">{student}</span>
          {/each}
        </div>
      </div>
      <div class="navbar-item">
        <div class="buttons">
          <button class="button is-light" on:click={() => { showClassIdPopop(classId) }}>
            <strong>Class: {classId}</strong>
          </button>
        </div>
      </div>
    </div>
  </div>
</nav>
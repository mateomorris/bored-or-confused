<script context="module">
  let classId;
	export async function preload(page, session) {
		classId = page.params.classId;
	}
</script>

<script>
  import Dashboard from './index.svelte'
</script>

<Dashboard existingClassId={classId} />
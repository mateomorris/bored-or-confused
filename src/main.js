import App from './App.svelte';

const app = new App({
	target: document.body,
  hydrate: true
	// props: {
	// 	test: 'world'
	// }
});

export default app;
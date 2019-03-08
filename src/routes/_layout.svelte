<script>
	import '../main.scss';
	import Nav from '../components/Nav.html';

	export let segment;
</script>

<style lang="scss">
	main {
		position: relative;
		max-width: 56em;
		padding: 2em;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>

<!-- <Nav {segment}/> -->

<main>
	<slot></slot>
</main>
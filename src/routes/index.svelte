<svelte:head>
	<title>Tree Decide</title>
</svelte:head>

<section class="hero">
	<div class="hero-body">
		<div class="container">
			<h1 class="title">Tree Decide</h1>
			<h2 class="subtitle">Find the tree that's right for you</h2>
		</div>
	</div>
</section>
<section class="section">
	<div class="container is fluid">
		<div class="field">
			<label class="label is-medium">Start by entering your zip:</label>
			<div class="control">
				<input class="input is-large" type="number" placeholder="Zipcode" minlength="5" bind:value={zipcode}>
			</div>
		</div>

		{#if error}
		<article class="message is-danger">
			<div class="message-body">
				{error}
			</div>
		</article>
		{/if}

		<button type="button"
			class="button is-primary is-large is-fullwidth"
			on:click={next}
			disabled={!valid}
			class:is-loading={loading}
		>Next</button>
	</div>
</section>

<style>
	.foo {}
</style>

<script>
import * as sapper from '@sapper/app';
import hardiness from '../services/hardiness';
import { state } from '../stores';

let zipcode = state.zipcode;
let error = '';
let valid = false;
let loading = false;
$: valid = (zipcode || '').toString().length >= 5;

state.subscribe(s => {
	zipcode = s.zipcode;
});

async function next() {
	error = '';
	loading = true;
	const zone = await hardiness(zipcode);
	if (!zone || !zone.zipcode) {
		loading = false;
		error = `Zipcode ${zipcode} not found`;
		return;
	}

	state.set(Object.assign({}, state, {
		zipcode,
		zone,
		minTemp: parseInt(zone.rangemin),
	}));

	console.log(zone);

	sapper.goto('/treetypes');
}
</script>
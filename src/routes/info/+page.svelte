<script lang="ts">
	import Button from '$lib/components/button.svelte';
</script>

<div class="flex grow flex-col gap-3 text-white">
	<div class="flex grow flex-col justify-between rounded-lg bg-main p-2 text-lg">
		<h1 class="text-4xl">App information</h1>
		<p>
			This application is developed by a team of four students at Københavns Mediegymnasium for
			their Teknologi B project.
		</p>
		<div class="grid grid-cols-2 gap-4">
			<div class="rounded-lg bg-light p-2">
				<img class="mb-2 rounded-lg" src="creators/Devin.png" alt="Devin" />
				<h1 class="text-2xl">Devin Munkager</h1>
			</div>
			<div class="rounded-lg bg-light p-2">
				<img class="mb-2 rounded-lg" src="creators/Frida.png" alt="Frida" />
				<h1 class="text-2xl">Frida Rosenaa</h1>
			</div>
			<div class="rounded-lg bg-light p-2">
				<img class="mb-2 rounded-lg" src="creators/Ida.png" alt="Ida" />
				<h1 class="text-2xl">Ida Lindhardsen</h1>
			</div>
			<div class="rounded-lg bg-light p-2">
				<img class="mb-2 rounded-lg" src="creators/Valdemar.png" alt="Valdemar" />
				<h1 class="text-2xl">Valdemar Stabell</h1>
			</div>
		</div>
		<p>
			The application is originally envisioned as a mobile app, it is made in Svelte and utilises
			SvelteKit for it's backend which means we've had to keep it as a website for now.
		</p>
		<p class="mb-3">
			The source code can be <a
				class="font-bold underline"
				href="https://github.com/coffandro/lovelaces/">found on Github</a
			>
		</p>
	</div>
	<div class="rounded-lg bg-main p-2">
		<Button text="Return" scale={3} href="/" />
	</div>
</div>

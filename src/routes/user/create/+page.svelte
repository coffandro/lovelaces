<script lang="ts">
	import Button from '$lib/components/button.svelte';
	import Dropdown from '$lib/components/dropdown.svelte';
	import FileInput from '$lib/components/fileInput.svelte';
	import InputField from '$lib/components/inputField.svelte';
	import MultiSelect from '$lib/components/multiSelect.svelte';
	import { formatDanishPhone } from '$lib/phone';
	import TextArea from '$lib/components/textArea.svelte';
	import { Gender, Sexuality, Pronoun, PronounString, GenderString } from '$lib/user';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();

	function formatPhoneBlur(e: FocusEvent, value: string) {
		const target = e.currentTarget as HTMLInputElement | null;
		if (!target) {
			return;
		}

		target.value = formatDanishPhone(value);
	}
</script>

<form method="POST" enctype="multipart/form-data" class="flex grow flex-col content-stretch gap-3">
	<div class="flex flex-col gap-1 rounded-lg bg-main p-2">
		<h1 class="text-2xl text-white">Account signup</h1>

		<h2 class="text-xl text-white">Practical info</h2>
		<InputField text="Name" id="name" type="text" required minlength="1" />
		<InputField text="Email" id="email" type="email" required />
		<InputField text="Password" id="password" type="password" required minlength="1" />
		<InputField
			text="Phone"
			id="phone"
			type="tel"
			required
			minlength="1"
			placeholder="+45 11 22 33 44"
			blurCallback={formatPhoneBlur}
		/>
	</div>

	<div class="flex flex-col gap-1 rounded-lg bg-main p-2">
		<h2 class="text-xl text-white">Personal info</h2>
		<FileInput text="Image" id="icon" required />
		<TextArea text="Bio" id="bio" required minlength="1" />
		<InputField text="Age" id="age" type="number" min="0" required />
		<InputField text="City" id="city" type="text" required minlength="1" />
	</div>

	<div class="flex flex-col gap-1 rounded-lg bg-main p-2">
		<h2 class="text-xl text-white">Identity</h2>
		<Dropdown
			text="Gender"
			id="gender"
			values={[Gender.MAN, Gender.WOMAN, Gender.NONBINARY]}
			labelFunction={GenderString}
			required
		/>

		<MultiSelect
			text="Pronouns"
			id="pronouns"
			values={[Pronoun.SHE, Pronoun.HE, Pronoun.THEY]}
			required
			labelFunction={(value: Pronoun) => {
				return PronounString([value]);
			}}
		/>

		<Dropdown
			text="Sexuality"
			id="sexuality"
			values={[Sexuality.STRAIGHT, Sexuality.GAY, Sexuality.BISEXUAL, Sexuality.PANSEXUAL]}
			labels={['Straight', 'Gay', 'Bisexual', 'Pansexual']}
			required
		/>
	</div>

	{#if form?.error}
		<div class="rounded-lg bg-main p-2">
			<h2 class="text-2xl text-white">Errors</h2>
			<p class="text-white/75">{form.message}</p>
		</div>
	{/if}

	<div class="grow"></div>

	<Button type="submit" scale={3} text="Submit" />
</form>

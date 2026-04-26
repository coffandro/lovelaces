<script lang="ts">
	import Button from '$lib/components/button.svelte';
	import Dropdown from '$lib/components/dropdown.svelte';
	import FileInput from '$lib/components/fileInput.svelte';
	import InputField from '$lib/components/inputField.svelte';
	import MultiSelect from '$lib/components/multiSelect.svelte';
	import TextArea from '$lib/components/textArea.svelte';
	import { Gender, Sexuality, Pronoun, PronounString, GenderString } from '$lib/user';

	let { form }: PageProps = $props();
</script>

<form
	method="POST"
	enctype="multipart/form-data"
	class="m-2 flex flex-col content-stretch gap-1 rounded-lg bg-main p-2"
>
	<InputField text="Name" id="name" type="text" />
	<InputField text="Email" id="email" type="email" />
	<InputField text="Password" id="password" type="password" />
	<FileInput text="Image" id="icon" />
	<InputField text="Phone" id="phone" type="tel" />

	<TextArea text="Bio" id="bio" />

	<InputField text="Age" id="age" type="number" min="0" />
	<InputField text="City" id="city" type="text" />

	<Dropdown
		text="Gender"
		id="gender"
		values={[Gender.MAN, Gender.WOMAN, Gender.NONBINARY]}
		labelFunction={GenderString}
	/>

	<MultiSelect
		text="Pronouns"
		id="Pronouns"
		values={[Pronoun.SHE, Pronoun.HE, Pronoun.THEY]}
		labelFunction={(value: Pronoun) => {
			return PronounString([value]);
		}}
	/>

	<Dropdown
		text="Sexuality"
		id="sexuality"
		values={[Sexuality.STRAIGHT, Sexuality.GAY, Sexuality.BISEXUAL, Sexuality.PANSEXUAL]}
		labels={['Straight', 'Gay', 'Bisexual', 'Pansexual']}
	/>

	{#if form?.error}
		<div class="text-black/50">
			<p>{form.message}</p>
		</div>
	{/if}

	<div class="grow"></div>

	<Button type="submit" classes="grow" text="Submit" />
</form>

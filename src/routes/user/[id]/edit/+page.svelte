<script lang="ts">
	import Button from '$lib/components/button.svelte';
	import FileInput from '$lib/components/fileInput.svelte';
	import InputField from '$lib/components/inputField.svelte';
	import { Gender, Sexuality, Pronoun } from '$lib/user';

	let { form }: PageProps = $props();
</script>

<form method="POST" enctype="multipart/form-data" class="flex flex-col content-stretch gap-1 p-2">
	<InputField text="Name" id="name" type="text" />
	<InputField text="Email" id="email" type="email" />
	<InputField text="Password" id="password" type="password" />
	<FileInput text="Image" id="icon" />
	<InputField text="Phone" id="phone" type="tel" />

	<!-- TODO: Make component -->
	<label>
		Bio
		<textarea name="bio" class="rounded-xl border p-1"></textarea>
	</label>

	<InputField text="Age" id="age" type="number" min="0" />
	<InputField text="City" id="city" type="text" />

	<!-- TODO: Make component -->
	<label>
		Gender
		<select name="gender" class="rounded-xl border p-1">
			<option value={Gender.MAN}>Man</option>
			<option value={Gender.WOMAN}>Woman</option>
			<option value={Gender.NONBINARY}>Nonbinary</option>
		</select>
	</label>

	<!-- TODO: Make component -->
	<fieldset class="rounded-xl border p-1">
		<legend>Pronouns</legend>
		<label>
			<input name="pronouns" type="checkbox" value={Pronoun.SHE} />
			She/Her
		</label>
		<label>
			<input name="pronouns" type="checkbox" value={Pronoun.HE} />
			He/Him
		</label>
		<label>
			<input name="pronouns" type="checkbox" value={Pronoun.THEY} />
			They/Them
		</label>
	</fieldset>

	<!-- TODO: Make component -->
	<label>
		Sexuality
		<select name="sexuality" class="rounded-xl border p-1">
			<option value={Sexuality.STRAIGHT}>Straight</option>
			<option value={Sexuality.GAY}>Gay</option>
			<option value={Sexuality.BISEXUAL}>Bisexual</option>
			<option value={Sexuality.PANSEXUAL}>Pansexual</option>
		</select>
	</label>

	{#if form?.error}
		<div class="text-black/50">
			<p>{form.message}</p>
		</div>
	{/if}

	<div class="grow"></div>

	<Button type="submit" classes="grow" text="Submit" />
</form>

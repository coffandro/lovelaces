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
	import Navbar from '$lib/components/navbar/navbar.svelte';
	import IndexNavs from '$lib/components/navbar/index-navs.svelte';

	let { data, form }: PageProps = $props();
	const user = $derived(data.user);

	function formatPhoneBlur(e: FocusEvent, value: string) {
		const target = e.currentTarget as HTMLInputElement | null;
		if (!target) {
			return;
		}

		target.value = formatDanishPhone(value);
	}

	async function deleteAccount() {
		if (!confirm('Are you sure you want to delete your account? This cannot be undone.')) {
			return;
		}

		try {
			const response = await fetch('/api/user/delete', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			const result = await response.json();

			if (response.ok) {
				// Redirect to home page after successful deletion
				window.location.href = '/';
			} else {
				alert(`Error: ${result.message}`);
			}
		} catch (error) {
			console.error('Failed to delete account:', error);
			alert('Failed to delete account. Please try again.');
		}
	}
</script>

<div class="flex grow flex-col gap-2">
	<Navbar><IndexNavs /></Navbar>

	<form
		method="POST"
		action="?/save"
		enctype="multipart/form-data"
		class="flex grow flex-col content-stretch gap-2"
	>
		<div class="flex flex-col gap-1 rounded-lg bg-main p-2">
			<h1 class="text-2xl text-white">Edit account</h1>

			<h2 class="text-xl text-white">Practical info</h2>
			<InputField text="Name" id="name" type="text" content={user.name} required minlength="1" />
			<InputField text="Email" id="email" type="email" content={user.email} required />
			<InputField
				text="Password"
				id="password"
				type="password"
				content={user.password}
				required
				minlength="1"
			/>
			<InputField
				text="Phone"
				id="phone"
				type="tel"
				content={formatDanishPhone(user.phone)}
				required
				minlength="1"
				placeholder="+45 11 22 33 44"
				blurCallback={formatPhoneBlur}
			/>
		</div>

		<div class="flex flex-col gap-1 rounded-lg bg-main p-2">
			<h2 class="text-xl text-white">Personal info</h2>
			<FileInput text="Image" id="icon" />
			<TextArea text="Bio" id="bio" content={user.bio} required minlength="1" />
			<InputField text="Age" id="age" type="number" min="0" content={String(user.age)} required />
			<InputField text="City" id="city" type="text" content={user.city} required minlength="1" />
		</div>

		<div class="flex flex-col gap-1 rounded-lg bg-main p-2">
			<h2 class="text-xl text-white">Identity</h2>
			<Dropdown
				text="Gender"
				id="gender"
				values={[Gender.MAN, Gender.WOMAN, Gender.NONBINARY]}
				labelFunction={GenderString}
				content={String(user.gender)}
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
				selected={user.pronouns}
			/>

			<Dropdown
				text="Sexuality"
				id="sexuality"
				values={[Sexuality.STRAIGHT, Sexuality.GAY, Sexuality.BISEXUAL, Sexuality.PANSEXUAL]}
				labels={['Straight', 'Gay', 'Bisexual', 'Pansexual']}
				content={String(user.sexuality)}
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

		<div class="grid grid-cols-2 gap-2 rounded-lg bg-main p-2">
			<Button type="button" callback={deleteAccount} scale={3} text="Delete account" />
			<Button type="submit" scale={3} text="Save" />
		</div>
	</form>
	<div class="grow"></div>

	<div class="rounded-lg bg-main p-2">
		<Button text="Return" scale={3} href="/" />
	</div>
</div>

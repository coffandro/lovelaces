<script lang="ts">
	
</script>

<form method="POST"enctype="multipart/form-data" class="flex flex-col gap-1 content-stretch m-2">
	<label>
		Name
		<input name="name" type="name" class="p-1 border rounded-xl">
	</label>
	<label>
		Icon
		<input name="icon" type="file" class="p-1 border rounded-xl">
	</label>
	<label>
		Email
		<input name="email" type="email" class="p-1 border rounded-xl">
	</label>
	<label>
		Phone
		<input name="phone" type="phone" class="p-1 border rounded-xl">
	</label>
	<label class="mb-2">
		Password
		<input name="password" type="password" class="p-1 border rounded-xl">
	</label>
	<button class="p-2 border rounded-lg">Submit</button>
</form>
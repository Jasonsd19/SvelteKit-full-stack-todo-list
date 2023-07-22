<script lang="ts">
	import { goto } from '$app/navigation';
	import TodoList from '$lib/components/todoList.svelte';
	import { deleteFormEl } from '$lib/store/deleteFormEl.js';
	import { selectedTodo } from '$lib/store/selected.js';
	import { todos } from '$lib/store/todos.js';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { enhance } from '$app/forms';
	import { disableButtons } from '$lib/store/disableButtons.js';
	import { updateFormEl } from '$lib/store/updateForm.js';
	import { filterOption } from '$lib/store/filterOption.js';
	import Swal from 'sweetalert2';

	export let data;
	export let form;

	let createInput = '';
	let createTextArea = '';
	let updateInput = '';
	let updateTextArea = '';

	let index: number = 0;

	const getFilteredTodos = (filter: string | null) => {
		if (filter) {
			if (filter === 'incomplete') return data.userTodos.filter((todo) => !todo.completed);
			if (filter === 'complete') return data.userTodos.filter((todo) => todo.completed);
		}
		return data.userTodos;
	};

	$: if (form?.errorMsg) {
		Swal.fire({
			title: 'Error',
			html: `<p style="font-size: 16px;">${form.errorMsg}</p>`,
			icon: 'error',
			confirmButtonText: '<div style="color: #000000;">Okay</div>',
			confirmButtonColor: '#e7e4e4'
		});
		form.errorMsg = '';
	}

	$: $todos = data.userTodos;
	$: $todos = getFilteredTodos($filterOption);

	$: updateInput = $selectedTodo?.name ?? '';
	$: updateTextArea = $selectedTodo?.description ?? '';

	$: index = $todos.findIndex((todoData) => todoData._id === $selectedTodo?._id);
	$: $selectedTodo = form?.index ? $todos[Number(form.index)] : null;

	const handleCreateNameUpdate = (e: Event) => {
		const event = e.currentTarget as HTMLInputElement;
		createInput = event.value;
	};

	const handleCreateDescUpdate = (e: Event) => {
		const event = e.currentTarget as HTMLTextAreaElement;
		createTextArea = event.value;
	};

	const handleUpdateNameUpdate = (e: Event) => {
		const event = e.currentTarget as HTMLInputElement;
		updateInput = event.value;
	};

	const handleUpdateDescUpdate = (e: Event) => {
		const event = e.currentTarget as HTMLTextAreaElement;
		updateTextArea = event.value;
	};

	const handleSubmit: SubmitFunction = () => {
		$disableButtons = true;
		createInput = '';
		createTextArea = '';
		return async ({ update }) => {
			await update();
			$disableButtons = false;
		};
	};

	const handleFilterOption = (e: Event) => {
		if (form?.index) form.index = '-1';
		const event = e.currentTarget as HTMLDivElement;
		if (event && $filterOption) {
			const oldFilterEl = document.getElementById($filterOption)!;
			oldFilterEl.classList.remove('selectedFilterOption');
			$filterOption = event.id;
			event.classList.add('selectedFilterOption');
		}
	};
</script>

<div class="mainContainer">
	<div class="header">
		<div class="githubLinkContainer">
			<div class="github">
				<a
					href="https://github.com/Jasonsd19/SvelteKit-full-stack-todo-list"
					target="_blank"
					rel="noreferrer noopener">GitHub Code</a
				>
			</div>
		</div>
		<div class="title">Unprocrastinator</div>
		<div class="logoutButtonContainer">
			<div
				class="logout"
				role="button"
				tabindex={0}
				on:click={() => goto('/logout')}
				on:keydown={() => goto('/logout')}
			>
				Logout
			</div>
		</div>
	</div>
	<div class="todoContainer">
		<div class="createModifyContainer">
			<div class="createTodoContainer">
				<div class="createFormHeader">Create Todo</div>
				<form method="POST" action="?/create" class="createForm" use:enhance={handleSubmit}>
					<label for="name">Name:</label>
					<input
						type="text"
						name="name"
						value={createInput}
						on:input={handleCreateNameUpdate}
						maxlength={50}
					/>
					<div style={`text-align: right; ${createInput.length > 50 ? 'color: red' : ''}`}>
						{`${createInput.length} / 50`}
					</div>
					<label for="description">Description:</label>
					<textarea
						class="descriptionInput"
						name="description"
						value={createTextArea}
						on:input={handleCreateDescUpdate}
						maxlength={400}
					/>
					<div style={`text-align: right; ${createTextArea.length > 400 ? 'color: red' : ''}`}>
						{`${createTextArea.length} / 400`}
					</div>
					<div class="createButtonContainer">
						<button disabled={$disableButtons}>Create</button>
					</div>
				</form>
			</div>
			<div class="modifyDeleteTodoContainer">
				<div class="modifyContainer">
					{#if $selectedTodo}
						<div class="createFormHeader">Modify Todo</div>
						<form method="POST" action="?/update" class="createForm" use:enhance={handleSubmit}>
							<label for="name">Name:</label>
							<input name="id" value={$selectedTodo._id} style="display: none;" />
							<input name="index" value={index} style="display: none;" />
							<input name="completed" value={$selectedTodo?.completed} style="display: none;" />
							<input
								type="text"
								name="name"
								value={updateInput}
								on:input={handleUpdateNameUpdate}
								maxlength={50}
							/>
							<div style={`text-align: right; ${updateInput.length > 50 ? 'color: red' : ''}`}>
								{`${updateInput.length} / 50`}
							</div>
							<label for="description">Description:</label>
							<textarea
								class="descriptionInput"
								name="description"
								value={updateTextArea}
								on:input={handleUpdateDescUpdate}
								maxlength={400}
							/>
							<div style={`text-align: right; ${updateTextArea.length > 400 ? 'color: red' : ''}`}>
								{`${updateTextArea.length} / 400`}
							</div>
							<div class="createButtonContainer">
								<button disabled={$disableButtons}>Update</button>
							</div>
						</form>
					{/if}
				</div>
				<div class="hiddenFormContainer">
					<form
						method="POST"
						action="?/delete"
						bind:this={$deleteFormEl}
						use:enhance={handleSubmit}
					>
						<input name="id" value={$selectedTodo?._id ?? 0} />
					</form>
				</div>
				<div class="hiddenFormContainer">
					<form
						method="POST"
						action="?/updateCompleted"
						bind:this={$updateFormEl}
						use:enhance={handleSubmit}
					>
						<input name="id" value={$selectedTodo?._id ?? 0} />
						<input name="completed" value={!$selectedTodo?.completed ?? false} />
						<input name="index" value={index} />
					</form>
				</div>
			</div>
		</div>
		<div class="listFilterContainer">
			<div class="filterTodo">
				<div
					id="all"
					class={`filterOption ${$filterOption === 'all' ? 'selectedFilterOption' : ''}`}
					role="button"
					tabindex={0}
					on:click={handleFilterOption}
					on:keydown={handleFilterOption}
				>
					All
				</div>
				<div
					id="incomplete"
					class={`filterOption ${$filterOption === 'incomplete' ? 'selectedFilterOption' : ''}`}
					role="button"
					tabindex={0}
					on:click={handleFilterOption}
					on:keydown={handleFilterOption}
				>
					Incomplete
				</div>
				<div
					id="complete"
					class={`filterOption ${$filterOption === 'complete' ? 'selectedFilterOption' : ''}`}
					role="button"
					tabindex={0}
					on:click={handleFilterOption}
					on:keydown={handleFilterOption}
				>
					Complete
				</div>
			</div>
			<TodoList />
		</div>
	</div>
</div>

<style>
	label {
		text-align: center;
		align-content: center;
		justify-content: center;
	}

	button {
		font-size: 16px;
		background: none;
		border: none;
		cursor: pointer;
	}

	button:hover {
		color: #4c5152;
		text-decoration: underline;
	}

	.mainContainer {
		display: flex;
		flex-direction: column;
		width: 100vw;
		height: 100vh;
		overflow-x: hidden;
		overflow-y: hidden;
		background-color: rgb(255, 255, 255);
	}

	.header {
		display: flex;
		justify-content: space-between;
		width: 100vw;
		min-height: 7vh;
		border-bottom: 1px solid black;
		background-color: rgb(231, 228, 228);
	}

	.githubLinkContainer {
		display: flex;
		width: 33%;
		justify-content: left;
		align-content: center;
		padding-left: 5vw;
		font-size: 17.5px;
	}

	.github {
		display: flex;
		flex-wrap: wrap;
		align-content: center;
		text-align: center;
		cursor: pointer;
	}

	.github a {
		text-decoration: none;
		color: #000000;
	}

	.github a:hover {
		color: rgb(90, 109, 211);
		text-decoration: underline;
	}

	.title {
		display: flex;
		flex-wrap: wrap;
		width: 33%;
		justify-content: center;
		text-align: center;
		align-content: center;
		font-size: 30px;
	}

	.logoutButtonContainer {
		display: flex;
		width: 33%;
		justify-content: right;
		padding-right: 5vw;
		font-size: 17.5px;
	}

	.logout {
		display: flex;
		flex-wrap: wrap;
		align-content: center;
		text-align: center;
		cursor: pointer;
	}

	.logout:hover {
		color: rgb(90, 109, 211);
		text-decoration: underline;
	}

	.todoContainer {
		display: flex;
		flex-direction: row;
		height: 100vh;
	}

	.createModifyContainer {
		display: flex;
		width: 25%;
		flex-direction: column;
	}

	.createTodoContainer {
		display: flex;
		width: 100%;
		height: 50%;
		flex-direction: column;
		justify-content: center;
	}

	.createFormHeader {
		width: 100%;
		text-align: center;
		padding-top: 1vh;
		font-size: 18px;
		background-color: rgb(231, 228, 228);
	}

	.createForm {
		display: flex;
		flex-direction: column;
		padding-left: 3vw;
		padding-right: 3vw;
		background-color: #e7e4e4;
	}

	.createForm input {
		border: none;
		border: solid 1px #000000;
		border-radius: 5px;
	}

	.createForm textarea {
		border: none;
		border: solid 1px #000000;
		border-radius: 5px;
	}

	.createForm label {
		text-align: left;
	}

	.descriptionInput {
		width: 100%;
		height: 20vh;
		resize: none;
	}

	.createButtonContainer {
		display: flex;
		justify-content: space-evenly;
	}

	.modifyDeleteTodoContainer {
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	.modifyContainer {
		display: flex;
		height: 50%;
		flex-direction: column;
		align-content: center;
	}

	.hiddenFormContainer {
		display: none;
	}

	.errorMessage {
		position: relative;
		align-content: center;
		justify-content: center;
		text-align: center;
		color: red;
		font-size: 0.75vw;
		padding-left: 1vw;
		padding-right: 1vw;
	}

	.crossIcon {
		position: absolute;
		top: -80%;
		right: 2.5%;
		cursor: pointer;
	}

	.listFilterContainer {
		width: 800%;
		min-height: 100%;
	}

	.filterTodo {
		display: flex;
		justify-content: left;
		text-align: center;
	}

	.filterOption {
		margin-top: 0.5vw;
		margin-left: 1vw;
		margin-right: 1vw;
		color: #4c5152;
		text-decoration: underline;
		cursor: pointer;
	}

	.selectedFilterOption {
		color: black;
		text-decoration: none;
		cursor: default;
	}

	@media screen and (max-width: 650px) {
		button {
			padding-top: 1vh;
			font-size: 16px;
		}

		.title {
			font-size: 24px;
		}

		.githubLinkContainer {
			padding-left: 2vw;
			font-size: 15px;
		}

		.logoutButtonContainer {
			padding-right: 2vw;
			font-size: 18px;
		}

		.createFormHeader {
			padding-bottom: 1vh;
		}

		.createForm {
			font-size: 16px;
		}
	}

	@media screen and (max-width: 300px) {
		button {
			padding-top: 1vh;
			font-size: 14px;
		}

		.title {
			margin-left: 3vw;
			font-size: 18px;
		}

		.githubLinkContainer {
			padding-left: 1vw;
			font-size: 13px;
		}

		.logoutButtonContainer {
			padding-right: 1vw;
			font-size: 15px;
		}

		.createFormHeader {
			padding-bottom: 1vh;
			font-size: 14px;
		}

		.createForm {
			font-size: 12px;
		}
	}

	@media screen and (min-width: 1200px) {
		.githubLinkContainer {
			padding-left: 4vw;
		}

		.header {
			height: 6vh;
		}

		.logoutButtonContainer {
			padding-right: 4vw;
		}
	}
</style>

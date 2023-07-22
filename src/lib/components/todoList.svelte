<script lang="ts">
	import { deleteFormEl } from '$lib/store/deleteFormEl';
	import { disableButtons } from '$lib/store/disableButtons';
	import { selectedTodo } from '$lib/store/selected';
	import { todos } from '$lib/store/todos';
	import { updateFormEl } from '$lib/store/updateForm';

	const updateSelectedTodo = () => {
		if ($updateFormEl && !$disableButtons) {
			$disableButtons = true;
			$updateFormEl.submit();
		}
	};

	const deleteSelectedTodo = () => {
		if ($deleteFormEl && !$disableButtons) {
			$disableButtons = true;
			$deleteFormEl.submit();
		}
	};

	const onMouseEnterTodo = (e: Event) => {
		const event = e.target as HTMLDivElement;
		if (event.classList.contains('selected')) return;
		event.classList.add('todoContainerHover');
	};

	const onMouseLeaveTodo = (e: Event) => {
		const event = e.target as HTMLDivElement;
		event.classList.remove('todoContainerHover');
	};
</script>

<div class="todoListContainer">
	{#if !$todos?.length}
		<div class="emptyTodo">
			<p>
				You have no todos!<br /><br /> Create new todos by using the creation form on the left.
			</p>
		</div>
	{:else}
		{#each $todos as todo, i (i)}
			<div
				class={`todoContainer ${i % 2 === 0 ? 'tile' : ''} ${
					$selectedTodo?._id === todo._id ? 'selected' : ''
				}`}
				style={todo.completed ? 'text-decoration: line-through;' : ''}
				role="button"
				tabindex="0"
				on:click={() => ($selectedTodo = { ...todo })}
				on:keydown={() => ($selectedTodo = { ...todo })}
				on:mouseenter={onMouseEnterTodo}
				on:mouseleave={onMouseLeaveTodo}
			>
				<div class="todoName">
					{todo.name}
				</div>
				<div class="todoDescription">
					{todo.description}
				</div>
				<div class="todoButtons">
					{#if $selectedTodo?._id === todo._id}
						<div
							class="deleteTodo"
							role="button"
							tabindex={0}
							on:click={deleteSelectedTodo}
							on:keydown={deleteSelectedTodo}
						>
							<img
								src={!$disableButtons ? '/assets/delete.svg' : '/assets/deleteDisabled.svg'}
								alt="delete"
							/>
						</div>
						<div
							class="todoCompleted"
							role="button"
							tabindex={0}
							on:click={updateSelectedTodo}
							on:keydown={updateSelectedTodo}
						>
							<img
								src={todo?.completed ? '/assets/completed.svg' : '/assets/incomplete.svg'}
								alt="delete"
								style="width: 20px;"
							/>
						</div>
					{/if}
				</div>
			</div>
		{/each}
	{/if}
</div>

<style>
	.todoListContainer {
		width: 100%;
		height: 89.75vh;
		overflow-y: auto;
		overflow-x: hidden;
	}

	.todoContainer {
		display: flex;
		width: 98.5%;
		min-height: 8vh;
		margin-top: 1vw;
		margin-left: 1vw;
	}

	.todoContainerHover {
		border: 1px dashed black;
	}

	.todoName {
		width: 20%;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-content: center;
		text-align: center;
		font-size: 15px;
		overflow-wrap: anywhere;
	}

	.todoDescription {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-content: center;
		text-align: left;
		padding-left: 1.5%;
		font-size: 15px;
		overflow-wrap: anywhere;
	}

	.todoButtons {
		width: 5%;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		text-align: center;
	}

	.deleteTodo {
		cursor: pointer;
	}

	.todoCompleted {
		cursor: pointer;
	}

	.emptyTodo {
		display: flex;
		height: 80%;
		width: 80%;
		flex-wrap: wrap;
		justify-content: center;
		align-content: center;
		text-align: center;
	}

	.tile {
		background-color: rgb(231, 228, 228);
	}

	.selected {
		border: 2px solid black;
	}

	@media screen and (max-width: 420px) {
		.todoName {
			width: 25%;
		}

		.todoButtons {
			padding-right: 8%;
		}
	}
</style>

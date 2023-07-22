<script lang="ts">
	import { onMount } from 'svelte';
	import AnimatedTodos from '$lib/components/animatedTodos.svelte';
	import LoginModal from '$lib/components/loginModal.svelte';
	import todoList from '$lib/mockData/displayTodos.json';
	import Swal from 'sweetalert2';

	export let form;

	const exampleTodos = todoList.todos;

	const numberOfRows = 5;
	const numberOfColumns = 5;
	const numberOfTodos = 18;

	const randomTodoMap = new Map<number, string>();
	const sentences: string[] = Array(numberOfRows * numberOfColumns).fill('');
	randomTodoMap.set(2, 'TODO');

	while (randomTodoMap.size < numberOfTodos) {
		const todoLocation = Math.floor(Math.random() * numberOfRows * numberOfColumns);
		if (!randomTodoMap.has(todoLocation)) {
			const currentTodos = [...randomTodoMap.values()];
			while (!randomTodoMap.has(todoLocation)) {
				const randomTodo = exampleTodos[Math.floor(Math.random() * exampleTodos.length)];
				if (!currentTodos.includes(randomTodo)) randomTodoMap.set(todoLocation, randomTodo);
			}
		}
	}

	onMount(() => {
		if (form?.errorMsg) {
			Swal.fire({
				title: 'Error',
				html: `<p style="font-size: 16px;">${form.errorMsg}</p>`,
				icon: 'error',
				confirmButtonText: '<div style="color: #000000;">Okay</div>',
				confirmButtonColor: '#e7e4e4'
			});
			form.errorMsg = '';
		}

		const writeNextChar = (
			sentenceIndex: number,
			todoIndex: number,
			length: number,
			typingSpeed: number
		) => {
			if (sentenceIndex < length) {
				sentences[todoIndex] += randomTodoMap.get(todoIndex)![sentenceIndex] + '';
				setTimeout(() => {
					writeNextChar(sentenceIndex + 1, todoIndex, length, typingSpeed);
				}, typingSpeed);
			}
			return;
		};
		for (const key of [...randomTodoMap.keys()]) {
			let timeout: number = Math.random() * 3000;
			if (key === 2) timeout = 0;
			setTimeout(() => {
				writeNextChar(0, key, randomTodoMap.get(key)!.length, Math.max(75, Math.random() * 125));
			}, timeout);
		}
	});
</script>

<div class="mainContainer">
	<AnimatedTodos {numberOfRows} {numberOfColumns} {randomTodoMap} {sentences} />
	<LoginModal />
</div>

<style>
	.mainContainer {
		display: flex;
		flex-direction: column;
		width: 100vw;
		height: 100vh;
		overflow-y: hidden;
		overflow-x: hidden;
		background-color: rgb(255, 255, 255);
	}
</style>

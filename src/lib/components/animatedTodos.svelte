<script lang="ts">
	export let numberOfRows: number;
	export let numberOfColumns: number;
	export let randomTodoMap: Map<number, string>;
	export let sentences: string[];
</script>

<div class="mainContainer">
	{#each Array(numberOfRows) as _, i (i)}
		<div
			class="animatedTextRow"
			style={`padding: ${Math.max(0.5, Math.random() * 1.5)}%; justify-content: ${
				Math.random() > 0.5 ? 'space-evenly' : 'space-around'
			}`}
		>
			{#each Array(numberOfColumns) as _, j (j)}
				<div
					class={`animatedTextContainer ${i * numberOfColumns + j === 2 ? 'mainTodo' : ''}`}
					style={i * numberOfColumns + j === 2
						? ''
						: `padding: ${Math.max(0.5, Math.random() * 1.5)}%;`}
				>
					{#if randomTodoMap.has(i * numberOfColumns + j)}
						<p>
							{`${sentences[i * numberOfColumns + j]}${
								sentences[i * numberOfColumns + j].length ===
									randomTodoMap.get(i * numberOfColumns + j)?.length ||
								sentences[i * numberOfColumns + j].length === 0
									? ''
									: '|'
							}`}
						</p>
					{/if}
				</div>
			{/each}
		</div>
	{/each}
</div>

<style>
	.mainContainer {
		width: 100vw;
		height: 100vh;
	}

	.animatedTextRow {
		display: flex;
		width: 100vw;
		height: 20%;
	}

	.animatedTextRow p {
		white-space: pre-line;
		font-family: 'Indie Flower', cursive;
	}

	.animatedTextContainer {
		display: flex;
		justify-content: center;
		width: 15%;
		height: 100%;
		font-size: 3.25vw;
	}

	.mainTodo {
		text-align: center;
		font-size: 6.25vw;
	}

	@media screen and (max-width: 280px) {
		.animatedTextContainer {
			font-size: 3.5vw;
		}

		.mainTodo {
			font-size: 7vw;
		}
	}

	@media screen and (min-width: 540px) {
		.animatedTextContainer {
			font-size: 2.5vw;
		}

		.mainTodo {
			font-size: 6.25vw;
		}
	}

	@media screen and (min-width: 650px) {
		.animatedTextContainer {
			font-size: 2vw;
		}

		.mainTodo {
			font-size: 4.75vw;
		}
	}

	@media screen and (min-width: 1000px) {
		.animatedTextContainer {
			font-size: 1.75vw;
		}

		.mainTodo {
			font-size: 4.75vw;
		}
	}

	@media screen and (min-width: 1200px) {
		.animatedTextContainer {
			font-size: 1.5vw;
		}
	}

	@media screen and (min-width: 1400px) {
		.animatedTextContainer {
			font-size: 1.4vw;
		}
	}

	@media screen and (min-width: 1600px) {
		.animatedTextContainer {
			font-size: 1.3vw;
		}

		.mainTodo {
			font-size: 4.75vw;
		}
	}
</style>

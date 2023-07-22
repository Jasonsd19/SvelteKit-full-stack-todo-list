<script lang="ts">
	import Swal from 'sweetalert2';

	let isLogin = true;
	const switchLogin = () => {
		isLogin = !isLogin;
	};

	const showInfoModal = () => {
		Swal.fire({
			title: 'You Should Know!',
			html: '<p style="font-size: 15px;">Usernames must be unique and at least 8 characters long.<br/><br/>Passwords must be at least 12 characters long, contain at least one uppercase and lowercase letter, one number, and one of !@#$%^&*</p>',
			icon: 'info',
			confirmButtonText: '<div style="color: #000000;">Understood</div>',
			confirmButtonColor: '#e7e4e4'
		});
	};
</script>

<div class="loginModal">
	<div class="inputContainer">
		{#if isLogin}
			<h1>Unprocrastinator</h1>
			<form method="POST" action="?/login">
				<div class="labelInputContainer">
					<label for="username">Username:</label>
					<input type="text" name="username" />
				</div>
				<div class="labelInputContainer">
					<label for="password">Password:</label>
					<input type="password" name="password" />
				</div>
				<div class="loginButtonContainer">
					<button>Login</button>
				</div>
			</form>
		{:else}
			<h1>Create an Account</h1>
			<form method="POST" action="?/create">
				<div class="labelInputContainer">
					<label for="username">Username:</label>
					<input type="text" name="username" />
				</div>
				<div class="labelInputContainer">
					<label for="password">Password:</label>
					<input type="password" name="password" />
				</div>
				<div class="loginButtonContainer">
					<button>Create Account</button>
				</div>
			</form>
			<div
				class="infoButton"
				role="button"
				tabindex={0}
				on:click={showInfoModal}
				on:keydown={showInfoModal}
			>
				<img src="assets/info.svg" alt="account information" />
			</div>
		{/if}
		<div class="signupButtonContainer">
			<button on:click={() => switchLogin()}>{isLogin ? 'Signup' : 'Back to Login'}</button>
		</div>
	</div>
</div>

<style>
	.loginModal {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		border: 1px solid black;
		background-color: rgb(231, 228, 228);
		font-size: 14px;
		padding: 2vw;
		border-radius: 10%;
		font-family: 'Courier New', Courier, monospace;
		animation: fadeIn 2.5s;
	}

	.loginModal h1 {
		width: 300px;
		text-align: center;
		font-size: 20px;
	}

	.inputContainer {
		display: flex;
		flex-direction: column;
	}

	.labelInputContainer {
		display: flex;
		justify-content: center;
		padding-top: 2.5vh;
	}

	.labelInputContainer label {
		padding-right: 0.5vw;
	}

	.labelInputContainer input {
		border: none;
		border: solid 1px #000000;
		border-radius: 5px;
		background-color: rgb(255, 255, 255);
	}

	button {
		background: none;
		border: none;
		cursor: pointer;
	}

	button:hover {
		color: #4c5152;
		text-decoration: underline;
	}

	.loginButtonContainer {
		text-align: center;
		padding-top: 2.5vh;
	}

	.signupButtonContainer {
		text-align: center;
		padding-top: 2.5vh;
	}

	.infoButton {
		position: absolute;
		width: 20px;
		right: 15px;
		top: 15px;
		animation: pulse 1s;
		animation-iteration-count: 2;
	}

	@media screen and (max-width: 280px) {
		.loginModal h1 {
			width: 250px;
		}

		.labelInputContainer label {
			width: 75px;
		}

		.infoButton {
			width: 15px;
			right: 10px;
			top: 10px;
		}
	}

	@media screen and (min-width: 1000px) {
		.loginModal h1 {
			width: 375px;
			font-size: 25px;
		}

		.labelInputContainer input {
			width: 200px;
		}

		.labelInputContainer label {
			font-size: 20px;
		}

		.loginModal {
			font-size: 16px;
		}

		.infoButton {
			width: 30px;
			right: 25px;
			top: 25px;
		}

		button {
			font-size: 16px;
		}
	}

	@keyframes fadeIn {
		0% {
			opacity: 0;
		}
		33% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}

	@keyframes pulse {
		0% {
			transform: scale(0.9);
			box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
		}

		70% {
			transform: scale(1.1);
			box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
		}

		100% {
			transform: scale(0.9);
			box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
		}
	}
</style>

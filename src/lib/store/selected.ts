import type { TodoData } from "$lib/types/types";
import { writable } from "svelte/store";

export const selectedTodo = writable<TodoData|null>(null)
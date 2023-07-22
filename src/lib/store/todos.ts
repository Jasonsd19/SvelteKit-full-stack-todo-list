import type { TodoData } from "$lib/types/types";
import { writable } from "svelte/store";

export const todos = writable(Array<TodoData>())
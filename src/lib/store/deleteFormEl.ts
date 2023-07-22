import { writable } from "svelte/store";

export const deleteFormEl = writable<HTMLFormElement|null>(null)
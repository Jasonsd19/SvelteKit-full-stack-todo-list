import { writable } from "svelte/store";

export const updateFormEl = writable<HTMLFormElement|null>(null)
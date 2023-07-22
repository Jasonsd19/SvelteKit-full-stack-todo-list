import { browser } from "$app/environment";
import { writable } from "svelte/store";

let storedFilter = null
if (browser) storedFilter = localStorage.getItem("filter") ?? "all"

export const filterOption = writable<string| null>(storedFilter)

filterOption.subscribe((value) => {
    if (browser && value) localStorage.setItem('filter', value)
})
import type { Actions, PageServerLoad } from "../$types";
import { createTodo } from "$lib/database/createTodo";
import { deleteTodo } from "$lib/database/deleteTodo";
import { getTodos } from "$lib/database/getTodos";
import { updateTodo } from "$lib/database/updateTodo";
import { updateTodoCompleted } from "$lib/database/updateTodoCompleted";

export const load: PageServerLoad = async (event) => {
    return getTodos(event)
}

export const actions: Actions = {
    create: async (event) => {
        return createTodo(event)
    },

    update: async (event) => {
        return updateTodo(event)
    },

    updateCompleted: async (event) => {
        return updateTodoCompleted(event)
    },

    delete: async (event) => {
        return deleteTodo(event)
    }
};
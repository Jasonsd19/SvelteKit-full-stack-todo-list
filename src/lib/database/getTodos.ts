import { DB_NAME, DB_TODO_COLL } from "$env/static/private"
import { toData } from "$lib/helpers/toData"
import type { Todo, TodoData } from "$lib/types/types"
import type { ServerLoadEvent } from "@sveltejs/kit"
import { getClient } from "./client"

export const getTodos = async (event: ServerLoadEvent) => {
    const { locals } = event

    const username = locals.username
    const query = {
        created_by: username
    }

    try {
        const client = await getClient()
        const todoResult = await client.db(DB_NAME).collection<Todo>(DB_TODO_COLL).find<Todo>(query).toArray()
        await client.close()
        const userTodos: TodoData[] = todoResult.map((todo) => toData(todo))
    
        return { userTodos }
    } catch (error) {
        console.log("Err - ", error)
        return { userTodos: [], errorMsg: "Error retrieving todos, please try again later." }
    }
}
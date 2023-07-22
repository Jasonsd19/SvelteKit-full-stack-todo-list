import { DB_NAME, DB_TODO_COLL } from "$env/static/private"
import type { RequestEvent } from "../../routes/$types";
import type { Todo } from "$lib/types/types.js";
import { ObjectId } from "mongodb";
import { getClient } from "./client";
import { fail } from "@sveltejs/kit";

export const deleteTodo = async (event: RequestEvent) => {
    const { request, locals } = event
    const username = locals.username

    const data = await request.formData()
    const id = data.get('id') as string
    const filter = {
        _id: new ObjectId(id),
        created_by: username
    }

    try {        
        const client = await getClient()
        const todosCollection = client.db(DB_NAME).collection<Todo>(DB_TODO_COLL)
        const deleteTodo = await todosCollection.deleteOne(filter)
        await client.close()

        return deleteTodo.acknowledged ? {} : fail(400, {errorMsg: "Failed to delete, please try again later"})
    } catch (error) {
        console.log("Err - ", error)
        return fail(400, {errorMsg: "Failed to delete, please try again later"})
    }
}
import { DB_NAME, DB_TODO_COLL } from "$env/static/private"
import type { RequestEvent } from "../../routes/$types";
import type { Todo } from "$lib/types/types.js";
import { ObjectId } from "mongodb";
import { getClient } from "./client";
import { fail } from "@sveltejs/kit";

export const updateTodoCompleted = async (event: RequestEvent) => {
    const { request } = event

    const data = await request.formData()

    const id = data.get("id") as string
    const index = data.get('index') as string
    const completed = data.get('completed') === 'true'

    const filter = { _id: new ObjectId(id) }
    const newVals = { $set: {completed} }

    try {        
        const client = await getClient()
        const todosCollection = client.db(DB_NAME).collection<Todo>(DB_TODO_COLL)
        const result = await todosCollection.updateOne(filter, newVals)
        await client.close()
    
        return result?.acknowledged ? {index} : fail(400, {errorMsg: "Failed to update, please try again later", index})
    } catch (error) {
        console.log("Err - ", error)
        return fail(400, {errorMsg: "Failed to update, please try again later", index})
    }
}
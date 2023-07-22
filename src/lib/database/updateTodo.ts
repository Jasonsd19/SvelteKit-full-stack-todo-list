import { DB_NAME, DB_TODO_COLL } from "$env/static/private"
import type { RequestEvent } from "../../routes/$types";
import type { Todo } from "$lib/types/types.js";
import { ObjectId } from "mongodb";
import { getClient } from "./client";
import { fail } from "@sveltejs/kit";

export const updateTodo = async (event: RequestEvent) => {
    const { request } = event

    const data = await request.formData()

    const id = data.get("id") as string
    const name = data.get('name') as string
    const description = data.get('description') as string
    const index = data.get('index') as string
    const completed = data.get('completed') === 'true'
    const updateInfo = { name, description }

    const filter = { _id: new ObjectId(id) }
    const newVals = { $set: {name, description, completed} }

    if (!name) return fail(400, {errorMsg: "Cannot have an empty name.", updateInfo, index})
    if (name.length > 50) return fail(400, {errorMsg: "Name must be less than or equal to 50 characters", updateInfo, index})
    if (!description) return fail(400, {errorMsg: "Cannot have an empty description.", updateInfo, index})
    if (description.length > 400) return fail(400, {errorMsg: "Description must be less than or equal to 400 characters", updateInfo, index})

    try {        
        const client = await getClient()
        const todosCollection = client.db(DB_NAME).collection<Todo>(DB_TODO_COLL)
        const result = await todosCollection.updateOne(filter, newVals)
        await client.close()
    
        return result.acknowledged ? {index} : fail(400, {errorMsg: "Failed to update, please try again later", updateInfo, index})
    } catch (error) {
        console.log("Err - ", error)
        return fail(400, {errorMsg: "Failed to update, please try again later", updateInfo, index})
    }
}
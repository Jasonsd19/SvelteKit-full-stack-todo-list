import { DB_NAME, DB_TODO_COLL } from "$env/static/private"
import type { RequestEvent } from "../../routes/$types";
import { Todo } from "$lib/types/types.js";
import { ObjectId } from "mongodb";
import { getClient } from "./client";
import { fail } from "@sveltejs/kit";

export const createTodo = async (event: RequestEvent) => {
    const { request, locals } = event

    const username = locals.username
    const data = await request.formData()

    const name = data.get('name') as string
    const description = data.get('description') as string

    if (!name) return fail(400, {errorMsg: "Your todo cannot have an empty name."})
    if (name.length > 50) return fail(400, {errorMsg: "Name must be less than or equal to 50 characters"})
    if (!description) return fail(400, {errorMsg: "Your todo cannot have an empty description."})
    if (description.length > 400) return fail(400, {errorMsg: "Description must be less than or equal to 400 characters"})

    const completed = false;
    const created = new Date()

    const newTodo = new Todo(new ObjectId(), username, name, description, created, completed)

    try {
        const client = await getClient()
        const todosCollection = client.db(DB_NAME).collection<Todo>(DB_TODO_COLL)
        const insertTodo = await todosCollection.insertOne(newTodo)
        await client.close()

        return insertTodo.acknowledged ? {} : fail(400, {errorMsg: "Failed to create, please try again later"})
    } catch (error) {
        console.log("Err - ", error)
        return fail(400, {errorMsg: "Failed to create, please try again later"})
    }

}
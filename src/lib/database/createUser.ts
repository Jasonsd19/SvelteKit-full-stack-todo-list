import { DB_NAME, DB_USER_COLL } from "$env/static/private"
import type { RequestEvent } from "../../routes/$types"
import { SECRET_KEY } from '$env/static/private'
import { getClient } from '$lib/database/client.js';
import { User } from '$lib/types/types';
import bcrypt from 'bcrypt';
import Jwt from 'jsonwebtoken';
import { fail } from "@sveltejs/kit";

export const createUser = async (event: RequestEvent) => {
    const { request, cookies } = event
    const data = await request.formData()

    const username = data.get('username') as string
    const password = data.get('password') as string

    const passRegExp = new RegExp(/(?=.*[\d])(?=.*[a-z])(?=.*[A-Z])(?=.*[_\-!@#$%^&*])[\da-zA-Z_\-!@#$%^&*]{12,}/)

    if (username?.length < 8) return fail(400, {errorMsg: "Username is too short, it must be at least 8 characters long."})
    if (!passRegExp.test(password)) return fail(400, {errorMsg: "Passwords must be at least 12 characters long, contain at least one uppercase and lowercase letter, one number, and one of !@#$%^&*."})

    const userFilter = { username }
    try {
        const client = await getClient()
        const usersCollection = client.db(DB_NAME).collection<User>(DB_USER_COLL)
        const user = await usersCollection.findOne<User>(userFilter)
    
        if (user) return fail(400, {errorMsg: "Username already in use"})
    
        const hash = await bcrypt.hash(password, 10)
        const newUser = await usersCollection.insertOne(new User(username, hash))
    
        await client.close()
    
        if (newUser?.acknowledged) {
            const token = Jwt.sign({ username }, SECRET_KEY, {expiresIn: 2592000})
            cookies.set("token", token, {path: '/'})
            return
        }
        return fail(400, {errorMsg: "Error creating account, please try again later."})
    } catch (error) {
        console.log("Err - ", error)
        return fail(400, {errorMsg: "Error creating account, please try again later."})
    }
}
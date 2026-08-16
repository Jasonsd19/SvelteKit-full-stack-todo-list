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

    const usernameValue = data.get('username')
    const password = data.get('password')
    const username = typeof usernameValue === 'string' ? usernameValue.trim().toLowerCase() : ''

    const passRegExp = /^(?=.*\d)(?=.*[A-Z]).{10,}$/

    if (username.length < 5) return fail(400, {errorMsg: "Username is too short, it must be at least 5 characters long."})
    if (typeof password !== 'string' || !passRegExp.test(password)) return fail(400, {errorMsg: "Passwords must be at least 10 characters long and contain at least one uppercase letter and one number."})

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

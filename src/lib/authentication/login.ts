import { SECRET_KEY, DB_NAME, DB_USER_COLL } from "$env/static/private"
import { getClient } from "$lib/database/client"
import type { User } from "$lib/types/types"
import { fail } from "@sveltejs/kit";
import type { RequestEvent } from "../../routes/$types"
import bcrypt from 'bcrypt';
import Jwt from 'jsonwebtoken';

export const loginUser = async (event: RequestEvent) => {
    const { request, cookies } = event

    const data = await request.formData()

    const username = data.get('username') as string
    const password = data.get('password') as string
    const userFilter = { username }

    try {
        const client = await getClient()
        const usersCollection = client.db(DB_NAME).collection(DB_USER_COLL)
        const user = await usersCollection.findOne<User>(userFilter)
    
        if (!user) return fail(400, {errorMsg: "User with that name does not exist, please create an account."})
        if (!await bcrypt.compare(password, user.password)) return fail(400, {errorMsg: "The password for the given username is incorrect."})
    
        await client.close()
    
        const token = Jwt.sign({ username }, SECRET_KEY, {expiresIn: 604800})
        cookies.set("token", token, {path: '/', sameSite: "strict", maxAge: 604800})
    } catch (error) {
        console.log("Err - ", error)
        return fail(400, {errorMsg: "Error authenticating user, please try again later."})
    }
}
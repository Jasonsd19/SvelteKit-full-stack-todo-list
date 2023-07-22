import { SECRET_KEY } from "$env/static/private"
import type { RequestEvent } from "@sveltejs/kit"
import Jwt from 'jsonwebtoken'

export const authenticateUser = (event: RequestEvent) => {
    const { cookies } = event
    let user= ''

    const token = cookies.get('token')
    if (token) {
        try {
            const { username } = Jwt.verify(token, SECRET_KEY) as {
                username: string
            }
            user = username
        } catch (error) {
            cookies.delete("token")
        }
    }

    return user
}
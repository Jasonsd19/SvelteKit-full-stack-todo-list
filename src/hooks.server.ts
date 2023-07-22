import { authenticateUser } from "$lib/authentication/authenticateUser"
import { redirect, type Handle, type HandleServerError } from "@sveltejs/kit"

export const handle: Handle = async ({ event, resolve }) => {
    const username = authenticateUser(event)

    if (username) event.locals.username = username
    if (!username && event.url.pathname !== '/') throw redirect(302, '/')

    const response = await resolve(event)
    return response
}

export const handleError: HandleServerError = async ({event}) => {
    if (event.url.pathname !== '/') throw redirect(302, '/')
}
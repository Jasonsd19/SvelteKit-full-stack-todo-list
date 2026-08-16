import { authenticateUser } from "$lib/authentication/authenticateUser"
import { redirect, type Handle, type HandleServerError } from "@sveltejs/kit"

export const handle: Handle = async ({ event, resolve }) => {
    const username = authenticateUser(event)
    const isPublicRoute = event.url.pathname === '/' || event.url.pathname === '/api/cron/keepalive'

    if (username) event.locals.username = username
    if (!username && !isPublicRoute) throw redirect(302, '/')

    const response = await resolve(event)
    return response
}

export const handleError: HandleServerError = async ({event}) => {
    if (event.url.pathname !== '/' && event.url.pathname !== '/api/cron/keepalive') throw redirect(302, '/')
}

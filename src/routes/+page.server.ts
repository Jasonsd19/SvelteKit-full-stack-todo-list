import type { Actions, PageServerLoad }  from './$types'
import { redirect } from '@sveltejs/kit';
import { loginUser } from '$lib/authentication/login';
import { createUser } from '$lib/database/createUser';

export const load: PageServerLoad = async ({ locals }) => {
    if (locals.username) throw redirect(302, '/dashboard')
}

export const actions: Actions = {
    login: async (event) => {
        const actionFailure = await loginUser(event)
        if (actionFailure) return actionFailure
        throw redirect(302, '/dashboard')
    },

    create: async (event) => {
        const actionFailure = await createUser(event)
        if (actionFailure) return actionFailure
        throw redirect(302, "/dashboard")
    }
};
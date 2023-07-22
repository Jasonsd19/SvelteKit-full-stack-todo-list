import { redirect } from '@sveltejs/kit'
import type { PageServerLoad }  from './$types'

export const load: PageServerLoad = async ({ cookies }) => {
    cookies.delete("token")
    throw redirect(302, "/")
}
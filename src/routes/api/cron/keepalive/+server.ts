import { DB_NAME } from '$env/static/private';
import { env } from '$env/dynamic/private';
import { getClient } from '$lib/database/client';
import { json, type RequestHandler } from '@sveltejs/kit';
import type { MongoClient } from 'mongodb';

export const GET: RequestHandler = async ({ request }) => {
	const cronSecret = env.CRON_SECRET;

	if (!cronSecret || request.headers.get('authorization') !== `Bearer ${cronSecret}`) {
		return json({ success: false }, { status: 401 });
	}

	let client: MongoClient | undefined;

	try {
		client = await getClient();
		await client.db(DB_NAME).command({ ping: 1 });

		return json({ success: true });
	} catch (error) {
		console.error('MongoDB keepalive failed', error);
		return json({ success: false }, { status: 500 });
	} finally {
		await client?.close();
	}
};

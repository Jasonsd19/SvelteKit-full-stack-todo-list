import * as mongoDB from "mongodb";
import { DB_CONN_STRING } from '$env/static/private'

export const getClient = async () => {
    try {
        const clientOptions = {
            connectTimeoutMS: 15000,
            socketTimeoutMS: 15000,
        }
        const client: mongoDB.MongoClient = new mongoDB.MongoClient(DB_CONN_STRING, clientOptions)
        await client.connect();
        return client
    } catch (error) {
        throw new Error(`Failed to connect to client - ${error}`);
    }
}
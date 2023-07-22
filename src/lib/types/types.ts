import type { ObjectId } from "mongodb";

export interface TodoData {
    _id: string
    created_by: string;
    name: string;
    description: string;
    created: Date;
    completed: boolean;
}

export class User {
    constructor(public username: string, public password: string, public _id?: ObjectId) {}
}

export class Todo {
    constructor(public _id: ObjectId, public created_by: string, public name: string, public description: string, public created: Date, public completed: boolean) {}
}

import { database } from "../db/db";
import { ObjectId } from "mongodb";

export interface User {
    _id: ObjectId;
    fullName: string;
    email: string;
    password: string;
    image?: string;
    registrationDate: Date;
}

export const users = database.collection<User>("users");
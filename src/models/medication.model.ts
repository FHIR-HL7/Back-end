import { database } from "../db/db";
import { ObjectId } from "mongodb";

export interface Medication {
    _id: ObjectId;
    suppliedOrganizationIds?: ObjectId[];
    name: string;
    description?: string;
    code: string;
    manufacturer: string;
    form: string;
    amount: number;
    unit: string;
    isActive: boolean;
    expirationDate: Date;
}

export const medications = database.collection<Medication>("medications");
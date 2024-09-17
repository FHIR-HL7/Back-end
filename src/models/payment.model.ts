import { database } from "../db/db";
import { ObjectId } from "mongodb";

export interface Payment {
    _id: ObjectId;
    encounterId: ObjectId;
    total: number;
    method: "cash" | "check" | "card" | "bank" | "other";
    paymentDate: Date;
    tax: number;
}

export const payments = database.collection<Payment>("payments");
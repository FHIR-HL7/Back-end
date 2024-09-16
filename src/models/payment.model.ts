import { database } from "../db/db";
import { ObjectId } from "mongodb";

export interface Payment {
    _id: ObjectId;
    encounterId: ObjectId;
    amount: number;
    currency: string;
    method: "cash" | "check" | "card" | "bank" | "other";
    paymentDate: Date;
}

export const payment = database.collection<Payment>("payments");
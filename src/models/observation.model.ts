import { database } from "../db/db";
import { ObjectId } from "mongodb";

export interface Observation {
    _id: ObjectId;
    diagnosticReportId: ObjectId;
    interpretation: string;
    code: string;
    value: string;
    unit: string;
}

export const observations = database.collection<Observation>("observations");
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

export const observation = database.collection<Observation>("observations");
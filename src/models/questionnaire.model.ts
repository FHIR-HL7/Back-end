import { database } from "../db/db";
import { ObjectId } from "mongodb";

export interface Questionnaire {
    _id: ObjectId;
    contributedPatientIds: ObjectId[];
    name: string;
    description?: string;
    questions: {
        question: string;
        type: "text" | "radio" | "checkbox";
        options?: string[];
    }[];
    purpose?: string;
    code: string;
    createdAt: Date;
    version: number;
    url?: string;
    status: "draft" | "active" | "retired" | "unknown";
    effectivePeriod: {
        start: Date;
        end?: Date;
    };
    approvalDate?: Date;
    lastModified?: Date;
}

export const questionnaire = database.collection<Questionnaire>("questionnaires");
import { database } from "../db/db";
import { ObjectId } from "mongodb";
import { encounterStatus } from "../types/encounter.status";
import { encounterType } from "../types/encounter.type";

export interface Encounter {
    _id: ObjectId;
    patientId: ObjectId;
    practitionerId: ObjectId;
    organizationId: ObjectId;
    status: encounterStatus;
    type: encounterType;
    priority: "routine" | "urgent" | "asap" | "stat";
    reason?: string;
    period: {
        start: Date;
        end?: Date;
    };
    patientInstructions?: string;
}

export const encounters = database.collection<Encounter>("encounters");
import { database } from "../db/db";
import { ObjectId } from "mongodb";

export interface MedicationPrescription {
    _id: ObjectId;
    encounterId: ObjectId;
    medicationId: ObjectId;
    dosage: string;
    dosageInstruction: string;
    duration: string;
    refills: number;
    quantity: number;
    frequency: string;
}

export const medicationPrescriptions = database.collection<MedicationPrescription>("medicationPrescriptions");
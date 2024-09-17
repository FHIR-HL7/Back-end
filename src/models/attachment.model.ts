import { database } from "../db/db";
import { ObjectId } from "mongodb";

export interface Attachment {
    _id: ObjectId;
    entityId: ObjectId;
    entityType: "LabTest" | "DiagnosticReport" | "MedicationPrescription" | "Encounter" | "Patient" | "Practitioner" | "Organization";
    attachmentType: "image" | "pdf" | "doc" | "other";
    attachment: string;
    comments?: string;
}

export const attachments = database.collection<Attachment>("attachments");
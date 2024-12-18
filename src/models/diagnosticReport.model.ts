import { database } from "../db/db";
import { ObjectId } from "mongodb";

export interface DiagnosticReport {
    _id: ObjectId;
    patientId: ObjectId;
    practitionerId: ObjectId;
    organizationId: ObjectId;
    encounterId: ObjectId;
    labTestIds: ObjectId[];
    name: string;
    issuedDate: Date;
    status: "registered" | "partial" | "preliminary" | "final";
    category: string;
    subject: string;
    conclusion?: string;
}

export const diagnosticReports = database.collection<DiagnosticReport>("diagnosticReports");
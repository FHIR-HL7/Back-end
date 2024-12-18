import { ObjectId } from "mongodb";

export interface CreateAttachmentRequest {
  entityId: ObjectId;
  entityType: "LabTest" | "DiagnosticReport" | "MedicationPrescription" | "Encounter" | "Patient" | "Practitioner" | "Organization";
  attachmentType: "image" | "pdf" | "doc" | "other";
  attachment: string;
  comments?: string;
}

export interface CreateAttachmentResponse {
  _id: ObjectId;
}
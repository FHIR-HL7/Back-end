import { ObjectId } from "mongodb";

export interface CreateDiagnosticReportRequest {
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

export interface CreateDiagnosticReportResponse {
  _id: ObjectId;
}
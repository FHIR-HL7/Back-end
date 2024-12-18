import { ObjectId } from "mongodb";

export interface CreateObservationRequest {
  diagnosticReportId: ObjectId;
  interpretation: string;
  code: string;
  value: string;
  unit: string;
}

export interface CreateObservationResponse {
  _id: ObjectId;
}
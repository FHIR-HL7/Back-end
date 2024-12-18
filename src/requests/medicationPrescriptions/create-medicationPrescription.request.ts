import { ObjectId } from "mongodb";

export interface CreateMedicationPrescriptionRequest {
  encounterId: ObjectId;
  medicationId: ObjectId;
  dosage: string;
  dosageInstruction: string;
  duration: string;
  refills: number;
  quantity: number;
  frequency: string;
}

export interface CreateMedicationPrescriptionResponse {
  _id: ObjectId;
}
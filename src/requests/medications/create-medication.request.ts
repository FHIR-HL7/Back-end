import { ObjectId } from "mongodb";

export interface CreateMedicationRequest {
//   suppliedOrganizationIds: string[];
  name: string;
  description?: string;
  code: string;
  manufacturer: string;
  form: string;
  amount: number;
  unit: string;
  isActive: boolean;
  expirationDate: string;
}

export interface CreateMedicationResponse {
  _id: ObjectId;
}
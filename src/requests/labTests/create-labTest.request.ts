import { ObjectId } from "mongodb";

export interface CreateLabTestRequest {
  patientId: ObjectId;
  practitionerId: ObjectId;
  organizationId: ObjectId;
  status: "requested" | "completed" | "in-progress" | "cancelled";
  testType: string;
  priority: "routine" | "urgent" | "asap" | "stat";
  sampleType: "blood" | "urine" | "saliva" | "stool" | "semen" | "other";
  reason?: string;
  testDate: Date;
  result?: string;
  resultStatus?: "normal" | "abnormal" | "in-progress";
  resultComments?: string;
  price: number;
}

export interface CreateLabTestResponse {
  _id: ObjectId;
}
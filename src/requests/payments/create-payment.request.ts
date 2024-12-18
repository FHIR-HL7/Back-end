import { ObjectId } from "mongodb";

export interface CreatePaymentRequest {
  encounterId: ObjectId;
  total: number;
  method: "cash" | "check" | "card" | "bank" | "other";
  paymentDate: Date;
  tax: number;
}

export interface CreatePaymentResponse {
  _id: ObjectId;
}
import { ObjectId } from "mongodb";

export interface CreateQuestionnaireRequest {
  contributedPatientIds?: ObjectId[];
  name: string;
  description?: string;
  questions: {
      question: string;
      type: "text" | "radio" | "checkbox";
      options?: string[];
  }[];
  purpose?: string;
  code: string;
  createdAt: Date;
  version?: number;
  url?: string;
  status: "draft" | "active" | "retired" | "unknown";
  effectivePeriod: {
      start: Date;
      end?: Date;
  };
  approvalDate?: Date;
  lastModified?: Date;
}

export interface CreateQuestionnaireResponse {
  _id: ObjectId;
}
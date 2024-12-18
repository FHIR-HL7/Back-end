import { ObjectId } from "mongodb";
import { encounterStatus } from "../../types/encounter.status";
import { encounterType } from "../../types/encounter.type";

export interface CreateEncounterRequest {
  patientId: ObjectId;
  practitionerId: ObjectId;
  organizationId: ObjectId;
  status: encounterStatus;
  type: encounterType;
  priority: "routine" | "urgent" | "asap" | "stat";
  reason?: string;
  period: {
      start: Date;
      end?: Date;
  };
  patientInstructions?: string;
}

export interface CreateEncounterResponse {
  _id: ObjectId;
}
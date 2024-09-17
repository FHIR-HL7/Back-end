import { database } from "../db/db";
import { ObjectId } from "mongodb";

export interface LabTest {
    _id: ObjectId;
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

export const labTests = database.collection<LabTest>("labTests");
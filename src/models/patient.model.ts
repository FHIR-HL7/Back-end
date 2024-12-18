import { ObjectId } from "mongodb";
import { database } from "../db/db";

export interface Patient {
    _id: ObjectId;
    managingOrganizationId?: ObjectId;
    generalPractitionerId?: ObjectId;
    name: {
        first: string;
        second: string;
        last: string;
    };
    email: string;
    gender: "male" | "female";
    nationalNumber: string;
    deceasedDate?: Date;
    phoneNumbers: string[];
    isActive: boolean;
    birthDate: Date;
    maritalStatus: "Single" | "Married" | "Divorced" | "Widowed";
    image?: string;
    address: {
        country: string;
        city: string;
        street?: string;
    };
    chronicDiseases?: string[];
    insurance?: {
        insuranceCompany: string;
        insuranceNumber: string
    };
    bloodType: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
    weight: number;
    height: number;
    emergencyContact: {
        name: string;
        phone: string;
    };
    heartRate: number;
    bodyTemperature: number;
    Glucose: number;
}
export const patients = database.collection<Patient>("patients");
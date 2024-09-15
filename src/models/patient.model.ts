import { ObjectId } from "mongodb";
import { database } from "../../db/db";

export interface Patient {
    _id: ObjectId;
    managingOrganizationId: ObjectId;
    generalPractitionerId: ObjectId;
    name: {
        first: string;
        second: string;
        last: string;
    };
    email: string;
    gender: "Male" | "Female";
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
}
export const patient = database.collection<Patient>("patients");
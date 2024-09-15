import { database } from "../../db/db";
import { ObjectId } from "mongodb";

export interface Practitioner {
    _id: ObjectId;
    managingOrganizationIds: ObjectId[];
    name: {
        first: string;
        second: string;
        last: string;
    };
    gender: "Male" | "Female";
    image?: string;
    specialty: string;
    phoneNumbers: string[];
    email:string;
    birthDate: Date;
    nationalNumber: string;
    isActive: boolean;
    address: {
        country: string;
        city: string;
        street?: string;
    };
    practiceLicense: string;
    qualifications: string[];
}

export const practitioner = database.collection<Practitioner>("practitioners");
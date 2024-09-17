import { ObjectId } from "mongodb";

export interface CreatePractitionerRequest {
    // managingOrganizationIds?: ObjectId[];
    name: {
        first: string;
        second: string;
        last: string;
    };
    gender: "Male" | "Female";
    image?: string;
    specialty: string;
    role: string;
    phoneNumbers: string[];
    email: string;
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
export interface CreatePractitionerResponse {
    _id: ObjectId;
}
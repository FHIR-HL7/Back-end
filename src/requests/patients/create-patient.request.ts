import { ObjectId } from "mongodb";
export interface CreatePatientRequest {
    // managingOrganizationId: ObjectId;
    // generalPractitionerId: ObjectId;
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

export interface CreatePatientResponse {
    _id: ObjectId;
  }

import { database } from "../db/db";
import { ObjectId } from "mongodb";
import { OrganizationType } from "../types/organization.type";

export interface Organization {
    _id: ObjectId;
    name: string;
    type: OrganizationType;
    phoneNumbers: string[];
    isActive: boolean;
    address: {
        country: string;
        city: string;
        street: string;
    };
    email: string;
}

export const organizations = database.collection<Organization>("organizations");

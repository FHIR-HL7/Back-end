import { ObjectId } from "mongodb";
import { OrganizationType } from "../../types/organization.type";

export interface CreateOrganizationRequest {
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

export interface CreateOrganizationResponse {
  _id: ObjectId;
}
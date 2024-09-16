import { ObjectId } from "mongodb";
 
export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}
 
export interface RegisterResponse {
  _id: ObjectId;
  registrationDate: Date;
}
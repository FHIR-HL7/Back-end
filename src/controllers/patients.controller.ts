import { RequestHandler, Request, Response } from "express";
import { CreatePatientRequest } from "../requests/patients/create-patient.request";
import { ObjectId } from "mongodb";
import { ImageHelper } from "../helpers/image.helper";
import { db } from "../models";
import { Patient } from "../models/patient.model";
import { JwtHelper } from "../helpers/JwtHelper";
import { createPatientSchema, updatePatientSchema } from "../validationSchemas";

const create: RequestHandler = async (
  req: Request<{}, {}, CreatePatientRequest>,
  res: Response
) => {
  const { error } = createPatientSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const userId = JwtHelper.getUserId(req);
  if (!userId) {
    return res.status(403).json({ message: "Invalid token" });
  }

  const newPatient: Patient = {
    _id: new ObjectId(),
    name: req.body.name,
    email: req.body.email,
    gender: req.body.gender,
    nationalNumber: req.body.nationalNumber,
    deceasedDate: req.body.deceasedDate || undefined,
    phoneNumbers: req.body.phoneNumbers,
    isActive: req.body.isActive,
    birthDate: req.body.birthDate,
    maritalStatus: req.body.maritalStatus,
    address: req.body.address,
    chronicDiseases: req.body.chronicDiseases || undefined,
    insurance: req.body.insurance || undefined,
    bloodType: req.body.bloodType,
    weight: req.body.weight,
    height: req.body.height,
    emergencyContact: req.body.emergencyContact,
  };

  if (req.file) {
    const fileName = `${newPatient._id}-${req.file.originalname}`;
    await ImageHelper.saveImageAsync(fileName, req.file.buffer);
    newPatient.image = fileName;
  } else {
    newPatient.image = "default-image.jpg";
  }
  await db.patients.insertOne(newPatient);
  return res.status(201).json(newPatient);
};

const deleteById: RequestHandler = async (req: Request, res: Response) => {
  const userId = JwtHelper.getUserId(req);
  if (!userId) {
    return res.status(403).json({ message: "Invalid token" });
  }
  const id = req.params.id;

  const patient = await db.patients.findOne({ _id: new ObjectId(id) });
  if (patient) {
    await db.patients.deleteOne({ _id: new ObjectId(id) });
    if (patient.image && patient.image !== "default-image.jpg") {
      await ImageHelper.deleteImage(patient.image);
    }
    return res.status(200).json({ message: "Patient deleted successfully" });
  }
  return res.status(404).json({ message: "Patient not found" });
};

const getAll: RequestHandler = async (req: Request, res: Response) => {
  const userId = JwtHelper.getUserId(req);
  if (!userId) {
    return res.status(403).json({ message: "Invalid token" });
  }

  const patients = await db.patients.find().toArray();
  return res.status(200).json(patients);
};

const getById: RequestHandler = async (req: Request, res: Response) => {
  const userId = JwtHelper.getUserId(req);
  if (!userId) {
    return res.status(403).json({ message: "Invalid token" });
  }

  const id = req.params.id;
  const patient = await db.patients.findOne({ _id: new ObjectId(id) });
  if (patient) {
    return res.status(200).json(patient);
  }
  return res.status(404).json({ message: "Patient not found" });
};

const updateById: RequestHandler = async (req: Request, res: Response) => {
  const { error } = updatePatientSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const userId = JwtHelper.getUserId(req);
  if (!userId) {
    return res.status(403).json({ message: "Invalid token" });
  }

  const id = req.params.id;
  const patient = await db.patients.findOne({ _id: new ObjectId(id) });
  if (!patient) {
    return res.status(404).json({ message: "Patient not found" });
  }

  const updateData: Partial<Patient> = {};
  if (req.body.name) {
    updateData.name = req.body.name;
  }
  if (req.body.email) {
    updateData.email = req.body.email;
  }
  if (req.body.gender) {
    updateData.gender = req.body.gender;
  }
  if (req.body.nationalNumber) {
    updateData.nationalNumber = req.body.nationalNumber;
  }
  if (req.body.deceasedDate) {
    updateData.deceasedDate = req.body.deceasedDate;
  }
  if (req.body.phoneNumbers) {
    updateData.phoneNumbers = req.body.phoneNumbers;
  }
  if (req.body.isActive) {
    updateData.isActive = req.body.isActive;
  }
  if (req.body.birthDate) {
    updateData.birthDate = req.body.birthDate;
  }
  if (req.body.maritalStatus) {
    updateData.maritalStatus = req.body.maritalStatus;
  }
  if (req.body.address) {
    updateData.address = req.body.address;
  }
  if (req.body.chronicDiseases) {
    updateData.chronicDiseases = req.body.chronicDiseases;
  }
  if (req.body.insurance) {
    updateData.insurance = req.body.insurance;
  }
  if (req.body.bloodType) {
    updateData.bloodType = req.body.bloodType;
  }
  if (req.body.weight) {
    updateData.weight = req.body.weight;
  }
  if (req.body.height) {
    updateData.height = req.body.height;
  }
  if (req.body.emergencyContact) {
    updateData.emergencyContact = req.body.emergencyContact;
  }

  if (req.file) {
    if (patient.image && patient.image !== "default-image.jpg") {
      await ImageHelper.deleteImage(patient.image);
    }

    const fileName = `${id}-${req.file.originalname}`;
    await ImageHelper.saveImageAsync(fileName, req.file.buffer);
    updateData.image = fileName;
  }

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ message: "Nothing to update" });
  }

  const result = await db.patients.updateOne(
    { _id: new ObjectId(id) },
    { $set: updateData }
  );

  if (result.matchedCount === 0) {
    return res.status(404).json({ message: "Patient not found" });
  }

  const updatedPatient = await db.patients.findOne({ _id: new ObjectId(id) });
  return res.status(200).json(updatedPatient);
};

export const patientsController = {
  create,
  deleteById,
  getAll,
  getById,
  updateById,
};
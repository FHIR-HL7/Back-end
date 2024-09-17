import { RequestHandler, Request, Response } from "express";
import { CreatePractitionerRequest, CreatePractitionerResponse } from "../requests/practitioners/create-practitioner.request";
import { ObjectId } from "mongodb";
import { ImageHelper } from "../helpers/image.helper";
import { db } from "../models";
import { Practitioner } from "../models/practitioner.model";
import { JwtHelper } from "../helpers/JwtHelper";
import { createPractitionerSchema, updatePractitionerSchema } from "../validationSchemas";

const create: RequestHandler = async (
  req: Request<{}, CreatePractitionerResponse, CreatePractitionerRequest>,
  res: Response
) => {
  const { error } = createPractitionerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const userId = JwtHelper.getUserId(req);
  if (!userId) {
    return res.status(403).json({ message: "Invalid token" });
  }

  const newPractitioner: Practitioner = {
    _id: new ObjectId(),
    name: req.body.name,
    email: req.body.email,
    gender: req.body.gender,
    nationalNumber: req.body.nationalNumber,
    specialty: req.body.specialty,
    phoneNumbers: req.body.phoneNumbers,
    isActive: req.body.isActive,
    birthDate: req.body.birthDate,
    role: req.body.role,
    address: req.body.address,
    practiceLicense: req.body.practiceLicense,
    qualifications: req.body.qualifications,
  };

  if (req.file) {
    const fileName = `${newPractitioner._id}-${req.file.originalname}`;
    await ImageHelper.saveImageAsync(fileName, req.file.buffer);
    newPractitioner.image = fileName;
  } else {
    newPractitioner.image = "default-image.jpg";
  }
  await db.practitioners.insertOne(newPractitioner);
  return res.status(201).json(newPractitioner);
};

const deleteById: RequestHandler = async (req: Request, res: Response) => {
  const userId = JwtHelper.getUserId(req);
  if (!userId) {
    return res.status(403).json({ message: "Invalid token" });
  }
  const id = req.params.id;

  const practitioner = await db.practitioners.findOne({ _id: new ObjectId(id) });
  if (practitioner) {
    await db.practitioners.deleteOne({ _id: new ObjectId(id) });
    if (practitioner.image && practitioner.image !== "default-image.jpg") {
      await ImageHelper.deleteImage(practitioner.image);
    }
    return res.status(200).json({ message: "practitioner deleted successfully" });
  }
  return res.status(404).json({ message: "practitioner not found" });
};

const getAll: RequestHandler = async (req: Request, res: Response) => {
  const userId = JwtHelper.getUserId(req);
  if (!userId) {
    return res.status(403).json({ message: "Invalid token" });
  }

  const practitioners = await db.practitioners.find().toArray();
  return res.status(200).json(practitioners);
};

const getById: RequestHandler = async (req: Request, res: Response) => {
  const userId = JwtHelper.getUserId(req);
  if (!userId) {
    return res.status(403).json({ message: "Invalid token" });
  }

  const id = req.params.id;
  const practitioner = await db.practitioners.findOne({ _id: new ObjectId(id) });
  if (practitioner) {
    return res.status(200).json(practitioner);
  }
  return res.status(404).json({ message: "practitioner not found" });
};

const updateById: RequestHandler = async (req: Request, res: Response) => {
  const { error } = updatePractitionerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const userId = JwtHelper.getUserId(req);
  if (!userId) {
    return res.status(403).json({ message: "Invalid token" });
  }

  const id = req.params.id;
  const practitioner = await db.practitioners.findOne({ _id: new ObjectId(id) });
  if (!practitioner) {
    return res.status(404).json({ message: "Practitioner not found" });
  }

  const updateData: Partial<Practitioner> = {};
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
  if (req.body.specialty) {
    updateData.specialty = req.body.specialty;
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
  if (req.body.role) {
    updateData.role = req.body.role;
  }
  if (req.body.address) {
    updateData.address = req.body.address;
  }
  if (req.body.practiceLicense) {
    updateData.practiceLicense = req.body.practiceLicense;
  }
  if (req.body.qualifications) {
    updateData.qualifications = req.body.qualifications;
  }

  if (req.file) {
    if (practitioner.image && practitioner.image !== "default-image.jpg") {
      await ImageHelper.deleteImage(practitioner.image);
    }

    const fileName = `${id}-${req.file.originalname}`;
    await ImageHelper.saveImageAsync(fileName, req.file.buffer);
    updateData.image = fileName;
  }

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ message: "Nothing to update" });
  }

  const result = await db.practitioners.updateOne(
    { _id: new ObjectId(id) },
    { $set: updateData }
  );

  if (result.matchedCount === 0) {
    return res.status(404).json({ message: "Practitioner not found" });
  }

  const updatedPractitioner = await db.practitioners.findOne({ _id: new ObjectId(id) });
  return res.status(200).json(updatedPractitioner);
};

export const practitionersController = {
  create,
  deleteById,
  getAll,
  getById,
  updateById,
};
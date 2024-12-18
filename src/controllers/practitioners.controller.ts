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

  const updateData: { [key: string]: any } = {};

  const updateNestedFields = (prefix: string, obj: any) => {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const fieldKey = `${prefix}.${key}`;
        updateData[fieldKey] = obj[key];
      }
    }
  };

  for (const key in req.body) {
    if (Object.prototype.hasOwnProperty.call(req.body, key)) {
      if (typeof req.body[key] === 'object' && !Array.isArray(req.body[key])) {
        updateNestedFields(key, req.body[key]);
      } else if (Array.isArray(req.body[key])) {
        updateData[key] = req.body[key];
      } else {
        updateData[key] = req.body[key];
      }
    }
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

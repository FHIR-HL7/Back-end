import { RequestHandler, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { db } from "../models";
import { Medication } from "../models/medication.model";
import { JwtHelper } from "../helpers/JwtHelper";
import { createMedicationSchema, updateMedicationSchema } from "../validationSchemas";
import { CreateMedicationRequest, CreateMedicationResponse } from "../requests/medications/create-medication.request";

const create: RequestHandler = async (
  req: Request<{}, CreateMedicationResponse, CreateMedicationRequest>,
  res: Response
) => {
  const { error } = createMedicationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const newMedication: Medication = {
    _id: new ObjectId(),
    name: req.body.name,
    description: req.body.description,
    code: req.body.code,
    manufacturer: req.body.manufacturer,
    form: req.body.form,
    amount: req.body.amount,
    unit: req.body.unit,
    isActive: req.body.isActive,
    expirationDate: new Date(req.body.expirationDate),
  };

  await db.medications.insertOne(newMedication);
  return res.status(201).json(newMedication);
};

const deleteById: RequestHandler = async (req: Request, res: Response) => {
  const userId = JwtHelper.getUserId(req);
  if (!userId) {
    return res.status(403).json({ message: "Invalid token" });
  }
  const id = req.params.id;

  const medication = await db.medications.findOne({ _id: new ObjectId(id) });
  if (medication) {
    await db.medications.deleteOne({ _id: new ObjectId(id) });
    return res.status(200).json({ message: "Medication deleted successfully" });
  }
  return res.status(404).json({ message: "Medication not found" });
};

const getAll: RequestHandler = async (req: Request, res: Response) => {
  const userId = JwtHelper.getUserId(req);
  if (!userId) {
    return res.status(403).json({ message: "Invalid token" });
  }

  const medications = await db.medications.find().toArray();
  return res.status(200).json(medications);
};

const getById: RequestHandler = async (req: Request, res: Response) => {
  const userId = JwtHelper.getUserId(req);
  if (!userId) {
    return res.status(403).json({ message: "Invalid token" });
  }

  const id = req.params.id;
  const medication = await db.medications.findOne({ _id: new ObjectId(id) });
  if (medication) {
    return res.status(200).json(medication);
  }
  return res.status(404).json({ message: "Medication not found" });
};

const updateById: RequestHandler = async (req: Request, res: Response) => {
  const { error } = updateMedicationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const userId = JwtHelper.getUserId(req);
  if (!userId) {
    return res.status(403).json({ message: "Invalid token" });
  }

  const id = req.params.id;
  const medication = await db.medications.findOne({ _id: new ObjectId(id) });
  if (!medication) {
    return res.status(404).json({ message: "Medication not found" });
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
        if ((medication as any)[key] && Array.isArray((medication as any)[key])) {
          const arrayLength = (medication as any)[key].length;
          req.body[key].forEach((item: any, index: number) => {
            if (index >= arrayLength) {
              return res.status(400).json({ message: `"${key}[${index}]" must not be a sparse array item` });
            }
          });
          updateData[key] = req.body[key];
        } else {
          updateData[key] = req.body[key];
        }
      } else {
        updateData[key] = req.body[key];
      }
    }
  }

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ message: "Nothing to update" });
  }

  const result = await db.medications.updateOne(
    { _id: new ObjectId(id) },
    { $set: updateData }
  );

  if (result.matchedCount === 0) {
    return res.status(404).json({ message: "Medication not found" });
  }

  const updatedMedication = await db.medications.findOne({ _id: new ObjectId(id) });
  return res.status(200).json(updatedMedication);
};

export const medicationsController = {
  create,
  deleteById,
  getAll,
  getById,
  updateById,
};
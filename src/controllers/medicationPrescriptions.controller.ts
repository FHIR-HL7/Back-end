import { RequestHandler, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { db } from "../models";
import { MedicationPrescription } from "../models/medicationPrescription.model";
import { JwtHelper } from "../helpers/JwtHelper";
import { createMedicationPrescriptionSchema, updateMedicationPrescriptionSchema } from "../validationSchemas";
import { CreateMedicationPrescriptionRequest, CreateMedicationPrescriptionResponse } from "../requests/medicationPrescriptions/create-medicationPrescription.request";

const create: RequestHandler = async (
  req: Request<{}, CreateMedicationPrescriptionResponse, CreateMedicationPrescriptionRequest>,
  res: Response
) => {
  const { error } = createMedicationPrescriptionSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

const newMedicationPrescription: MedicationPrescription = {
    _id: new ObjectId(),
    encounterId: new ObjectId(req.body.encounterId),
    medicationId: new ObjectId(req.body.medicationId),
    dosage: req.body.dosage,
    dosageInstruction: req.body.dosageInstruction,
    duration: req.body.duration,
    refills: req.body.refills,
    quantity: req.body.quantity,
    frequency: req.body.frequency,
};

  await db.medicationPrescriptions.insertOne(newMedicationPrescription);
  return res.status(201).json(newMedicationPrescription);
};

const deleteById: RequestHandler = async (req: Request, res: Response) => {
  const userId = JwtHelper.getUserId(req);
  if (!userId) {
    return res.status(403).json({ message: "Invalid token" });
  }
  const id = req.params.id;

  const medicationPrescription = await db.medicationPrescriptions.findOne({ _id: new ObjectId(id) });
  if (medicationPrescription) {
    await db.medicationPrescriptions.deleteOne({ _id: new ObjectId(id) });
    return res.status(200).json({ message: "MedicationPrescription deleted successfully" });
  }
  return res.status(404).json({ message: "MedicationPrescription not found" });
};

const getAll: RequestHandler = async (req: Request, res: Response) => {
  const userId = JwtHelper.getUserId(req);
  if (!userId) {
    return res.status(403).json({ message: "Invalid token" });
  }

  const medicationPrescriptions = await db.medicationPrescriptions.find().toArray();
  return res.status(200).json(medicationPrescriptions);
};

const getById: RequestHandler = async (req: Request, res: Response) => {
  const userId = JwtHelper.getUserId(req);
  if (!userId) {
    return res.status(403).json({ message: "Invalid token" });
  }

  const id = req.params.id;
  const medicationPrescription = await db.medicationPrescriptions.findOne({ _id: new ObjectId(id) });
  if (medicationPrescription) {
    return res.status(200).json(medicationPrescription);
  }
  return res.status(404).json({ message: "MedicationPrescription not found" });
};

const updateById: RequestHandler = async (req: Request, res: Response) => {
  const { error } = updateMedicationPrescriptionSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const userId = JwtHelper.getUserId(req);
  if (!userId) {
    return res.status(403).json({ message: "Invalid token" });
  }

  const id = req.params.id;
  const medicationPrescription = await db.medicationPrescriptions.findOne({ _id: new ObjectId(id) });
  if (!medicationPrescription) {
    return res.status(404).json({ message: "MedicationPrescription not found" });
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
        if ((medicationPrescription as any)[key] && Array.isArray((medicationPrescription as any)[key])) {
          const arrayLength = (medicationPrescription as any)[key].length;
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

  const result = await db.medicationPrescriptions.updateOne(
    { _id: new ObjectId(id) },
    { $set: updateData }
  );

  if (result.matchedCount === 0) {
    return res.status(404).json({ message: "MedicationPrescription not found" });
  }

  const updatedMedicationPrescription = await db.medicationPrescriptions.findOne({ _id: new ObjectId(id) });
  return res.status(200).json(updatedMedicationPrescription);
};

export const medicationPrescriptionsController = {
  create,
  deleteById,
  getAll,
  getById,
  updateById,
};
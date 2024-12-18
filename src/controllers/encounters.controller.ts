import { RequestHandler, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { db } from "../models";
import { Encounter } from "../models/encounter.model";
import { JwtHelper } from "../helpers/JwtHelper";
import { createEncounterSchema, updateEncounterSchema } from "../validationSchemas";
import { CreateEncounterRequest, CreateEncounterResponse } from "../requests/encounters/create-encounter.request";

const create: RequestHandler = async (
  req: Request<{}, CreateEncounterResponse, CreateEncounterRequest>,
  res: Response
) => {
  const { error } = createEncounterSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

const newEncounter: Encounter = {
    _id: new ObjectId(),
    patientId: new ObjectId(req.body.patientId),
    practitionerId: new ObjectId(req.body.practitionerId),
    organizationId: new ObjectId(req.body.organizationId),
    status: req.body.status,
    type: req.body.type,
    priority: req.body.priority,
    reason: req.body.reason,
    period: {
        start: new Date(req.body.period.start),
        end: req.body.period.end ? new Date(req.body.period.end) : undefined,
    },
    patientInstructions: req.body.patientInstructions,
};

  await db.encounters.insertOne(newEncounter);
  return res.status(201).json(newEncounter);
};

const deleteById: RequestHandler = async (req: Request, res: Response) => {
  const userId = JwtHelper.getUserId(req);
  if (!userId) {
    return res.status(403).json({ message: "Invalid token" });
  }
  const id = req.params.id;

  const encounter = await db.encounters.findOne({ _id: new ObjectId(id) });
  if (encounter) {
    await db.encounters.deleteOne({ _id: new ObjectId(id) });
    return res.status(200).json({ message: "Encounter deleted successfully" });
  }
  return res.status(404).json({ message: "Encounter not found" });
};

const getAll: RequestHandler = async (req: Request, res: Response) => {
  const userId = JwtHelper.getUserId(req);
  if (!userId) {
    return res.status(403).json({ message: "Invalid token" });
  }

  const encounters = await db.encounters.find().toArray();
  return res.status(200).json(encounters);
};

const getById: RequestHandler = async (req: Request, res: Response) => {
  const userId = JwtHelper.getUserId(req);
  if (!userId) {
    return res.status(403).json({ message: "Invalid token" });
  }

  const id = req.params.id;
  const encounter = await db.encounters.findOne({ _id: new ObjectId(id) });
  if (encounter) {
    return res.status(200).json(encounter);
  }
  return res.status(404).json({ message: "Encounter not found" });
};

const updateById: RequestHandler = async (req: Request, res: Response) => {
  const { error } = updateEncounterSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const userId = JwtHelper.getUserId(req);
  if (!userId) {
    return res.status(403).json({ message: "Invalid token" });
  }

  const id = req.params.id;
  const encounter = await db.encounters.findOne({ _id: new ObjectId(id) });
  if (!encounter) {
    return res.status(404).json({ message: "Encounter not found" });
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
        if ((encounter as any)[key] && Array.isArray((encounter as any)[key])) {
          const arrayLength = (encounter as any)[key].length;
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

  const result = await db.encounters.updateOne(
    { _id: new ObjectId(id) },
    { $set: updateData }
  );

  if (result.matchedCount === 0) {
    return res.status(404).json({ message: "Encounter not found" });
  }

  const updatedEncounter = await db.encounters.findOne({ _id: new ObjectId(id) });
  return res.status(200).json(updatedEncounter);
};

export const encountersController = {
  create,
  deleteById,
  getAll,
  getById,
  updateById,
};
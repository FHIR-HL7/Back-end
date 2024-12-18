import { RequestHandler, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { db } from "../models";
import { Observation } from "../models/observation.model";
import { JwtHelper } from "../helpers/JwtHelper";
import { createObservationSchema, updateObservationSchema } from "../validationSchemas";
import { CreateObservationRequest, CreateObservationResponse } from "../requests/observations/create-observation.request";

const create: RequestHandler = async (
  req: Request<{}, CreateObservationResponse, CreateObservationRequest>,
  res: Response
) => {
  const { error } = createObservationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

const newObservation: Observation = {
    _id: new ObjectId(),
    diagnosticReportId: new ObjectId(req.body.diagnosticReportId),
    interpretation: req.body.interpretation,
    code: req.body.code,
    value: req.body.value,
    unit: req.body.unit,
};

  await db.observations.insertOne(newObservation);
  return res.status(201).json(newObservation);
};

const deleteById: RequestHandler = async (req: Request, res: Response) => {
  const userId = JwtHelper.getUserId(req);
  if (!userId) {
    return res.status(403).json({ message: "Invalid token" });
  }
  const id = req.params.id;

  const observation = await db.observations.findOne({ _id: new ObjectId(id) });
  if (observation) {
    await db.observations.deleteOne({ _id: new ObjectId(id) });
    return res.status(200).json({ message: "Observation deleted successfully" });
  }
  return res.status(404).json({ message: "Observation not found" });
};

const getAll: RequestHandler = async (req: Request, res: Response) => {
  const userId = JwtHelper.getUserId(req);
  if (!userId) {
    return res.status(403).json({ message: "Invalid token" });
  }

  const observations = await db.observations.find().toArray();
  return res.status(200).json(observations);
};

const getById: RequestHandler = async (req: Request, res: Response) => {
  const userId = JwtHelper.getUserId(req);
  if (!userId) {
    return res.status(403).json({ message: "Invalid token" });
  }

  const id = req.params.id;
  const observation = await db.observations.findOne({ _id: new ObjectId(id) });
  if (observation) {
    return res.status(200).json(observation);
  }
  return res.status(404).json({ message: "Observation not found" });
};

const updateById: RequestHandler = async (req: Request, res: Response) => {
  const { error } = updateObservationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const userId = JwtHelper.getUserId(req);
  if (!userId) {
    return res.status(403).json({ message: "Invalid token" });
  }

  const id = req.params.id;
  const observation = await db.observations.findOne({ _id: new ObjectId(id) });
  if (!observation) {
    return res.status(404).json({ message: "Observation not found" });
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
        if ((observation as any)[key] && Array.isArray((observation as any)[key])) {
          const arrayLength = (observation as any)[key].length;
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

  const result = await db.observations.updateOne(
    { _id: new ObjectId(id) },
    { $set: updateData }
  );

  if (result.matchedCount === 0) {
    return res.status(404).json({ message: "Observation not found" });
  }

  const updatedObservation = await db.observations.findOne({ _id: new ObjectId(id) });
  return res.status(200).json(updatedObservation);
};

export const observationsController = {
  create,
  deleteById,
  getAll,
  getById,
  updateById,
};
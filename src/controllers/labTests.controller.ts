import { RequestHandler, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { db } from "../models";
import { LabTest } from "../models/labTest.model";
import { JwtHelper } from "../helpers/JwtHelper";
import { createLabTestSchema, updateLabTestSchema } from "../validationSchemas";
import { CreateLabTestRequest, CreateLabTestResponse } from "../requests/labTests/create-labTest.request";

const create: RequestHandler = async (
  req: Request<{}, CreateLabTestResponse, CreateLabTestRequest>,
  res: Response
) => {
  const { error } = createLabTestSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const newLabTest: LabTest = {
    _id: new ObjectId(),
    patientId: new ObjectId(req.body.patientId),
    practitionerId: new ObjectId(req.body.practitionerId),
    organizationId: new ObjectId(req.body.organizationId),
    status: req.body.status,
    testType: req.body.testType,
    priority: req.body.priority,
    sampleType: req.body.sampleType,
    reason: req.body.reason,
    testDate: new Date(req.body.testDate),
    result: req.body.result,
    resultStatus: req.body.resultStatus,
    resultComments: req.body.resultComments,
    price: req.body.price,
  };

  await db.labTests.insertOne(newLabTest);
  return res.status(201).json(newLabTest);
};

const deleteById: RequestHandler = async (req: Request, res: Response) => {
  const userId = JwtHelper.getUserId(req);
  if (!userId) {
    return res.status(403).json({ message: "Invalid token" });
  }
  const id = req.params.id;

  const labTest = await db.labTests.findOne({ _id: new ObjectId(id) });
  if (labTest) {
    await db.labTests.deleteOne({ _id: new ObjectId(id) });
    return res.status(200).json({ message: "LabTest deleted successfully" });
  }
  return res.status(404).json({ message: "LabTest not found" });
};

const getAll: RequestHandler = async (req: Request, res: Response) => {
  const userId = JwtHelper.getUserId(req);
  if (!userId) {
    return res.status(403).json({ message: "Invalid token" });
  }

  const labTests = await db.labTests.find().toArray();
  return res.status(200).json(labTests);
};

const getById: RequestHandler = async (req: Request, res: Response) => {
  const userId = JwtHelper.getUserId(req);
  if (!userId) {
    return res.status(403).json({ message: "Invalid token" });
  }

  const id = req.params.id;
  const labTest = await db.labTests.findOne({ _id: new ObjectId(id) });
  if (labTest) {
    return res.status(200).json(labTest);
  }
  return res.status(404).json({ message: "LabTest not found" });
};

const updateById: RequestHandler = async (req: Request, res: Response) => {
  const { error } = updateLabTestSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const userId = JwtHelper.getUserId(req);
  if (!userId) {
    return res.status(403).json({ message: "Invalid token" });
  }

  const id = req.params.id;
  const labTest = await db.labTests.findOne({ _id: new ObjectId(id) });
  if (!labTest) {
    return res.status(404).json({ message: "LabTest not found" });
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
        if ((labTest as any)[key] && Array.isArray((labTest as any)[key])) {
          const arrayLength = (labTest as any)[key].length;
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

  const result = await db.labTests.updateOne(
    { _id: new ObjectId(id) },
    { $set: updateData }
  );

  if (result.matchedCount === 0) {
    return res.status(404).json({ message: "LabTest not found" });
  }

  const updatedLabTest = await db.labTests.findOne({ _id: new ObjectId(id) });
  return res.status(200).json(updatedLabTest);
};

export const labTestsController = {
  create,
  deleteById,
  getAll,
  getById,
  updateById,
};
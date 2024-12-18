import { RequestHandler, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { db } from "../models";
import { Questionnaire } from "../models/questionnaire.model";
import { JwtHelper } from "../helpers/JwtHelper";
import { createQuestionnaireSchema, updateQuestionnaireSchema } from "../validationSchemas";
import { CreateQuestionnaireRequest, CreateQuestionnaireResponse } from "../requests/questionnaires/create-questionnaire.request";

const create: RequestHandler = async (
  req: Request<{}, CreateQuestionnaireResponse, CreateQuestionnaireRequest>,
  res: Response
) => {
  const { error } = createQuestionnaireSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

const newQuestionnaire: Questionnaire = {
    _id: new ObjectId(),
    name: req.body.name,
    description: req.body.description,
    questions: req.body.questions,
    purpose: req.body.purpose,
    code: req.body.code,
    createdAt: new Date(),
    version: req.body.version,
    url: req.body.url,
    status: req.body.status,
    effectivePeriod: {
        start: new Date(req.body.effectivePeriod.start),
        end: req.body.effectivePeriod.end ? new Date(req.body.effectivePeriod.end) : undefined,
    },
    approvalDate: req.body.approvalDate ? new Date(req.body.approvalDate) : undefined,
    lastModified: new Date(),
    contributedPatientIds: req.body.contributedPatientIds
};

  await db.questionnaires.insertOne(newQuestionnaire);
  return res.status(201).json(newQuestionnaire);
};

const deleteById: RequestHandler = async (req: Request, res: Response) => {
  const userId = JwtHelper.getUserId(req);
  if (!userId) {
    return res.status(403).json({ message: "Invalid token" });
  }
  const id = req.params.id;

  const questionnaire = await db.questionnaires.findOne({ _id: new ObjectId(id) });
  if (questionnaire) {
    await db.questionnaires.deleteOne({ _id: new ObjectId(id) });
    return res.status(200).json({ message: "Questionnaire deleted successfully" });
  }
  return res.status(404).json({ message: "Questionnaire not found" });
};

const getAll: RequestHandler = async (req: Request, res: Response) => {
  const userId = JwtHelper.getUserId(req);
  if (!userId) {
    return res.status(403).json({ message: "Invalid token" });
  }

  const questionnaires = await db.questionnaires.find().toArray();
  return res.status(200).json(questionnaires);
};

const getById: RequestHandler = async (req: Request, res: Response) => {
  const userId = JwtHelper.getUserId(req);
  if (!userId) {
    return res.status(403).json({ message: "Invalid token" });
  }

  const id = req.params.id;
  const questionnaire = await db.questionnaires.findOne({ _id: new ObjectId(id) });
  if (questionnaire) {
    return res.status(200).json(questionnaire);
  }
  return res.status(404).json({ message: "Questionnaire not found" });
};

const updateById: RequestHandler = async (req: Request, res: Response) => {
  const { error } = updateQuestionnaireSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const userId = JwtHelper.getUserId(req);
  if (!userId) {
    return res.status(403).json({ message: "Invalid token" });
  }

  const id = req.params.id;
  const questionnaire = await db.questionnaires.findOne({ _id: new ObjectId(id) });
  if (!questionnaire) {
    return res.status(404).json({ message: "Questionnaire not found" });
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
        if ((questionnaire as any)[key] && Array.isArray((questionnaire as any)[key])) {
          const arrayLength = (questionnaire as any)[key].length;
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

  const result = await db.questionnaires.updateOne(
    { _id: new ObjectId(id) },
    { $set: updateData }
  );

  if (result.matchedCount === 0) {
    return res.status(404).json({ message: "Questionnaire not found" });
  }

  const updatedQuestionnaire = await db.questionnaires.findOne({ _id: new ObjectId(id) });
  return res.status(200).json(updatedQuestionnaire);
};

export const questionnairesController = {
  create,
  deleteById,
  getAll,
  getById,
  updateById,
};
import { RequestHandler, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { db } from "../models";
import { DiagnosticReport } from "../models/diagnosticReport.model";
import { JwtHelper } from "../helpers/JwtHelper";
import { createDiagnosticReportSchema, updateDiagnosticReportSchema } from "../validationSchemas";
import { CreateDiagnosticReportRequest, CreateDiagnosticReportResponse } from "../requests/diagnosticReports/create-diagnosticReport.request";

const create: RequestHandler = async (
  req: Request<{}, CreateDiagnosticReportResponse, CreateDiagnosticReportRequest>,
  res: Response
) => {
  const { error } = createDiagnosticReportSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

const newDiagnosticReport: DiagnosticReport = {
    _id: new ObjectId(),
    patientId: new ObjectId(req.body.patientId),
    practitionerId: new ObjectId(req.body.practitionerId),
    organizationId: new ObjectId(req.body.organizationId),
    encounterId: new ObjectId(req.body.encounterId),
    labTestIds: req.body.labTestIds,
    name: req.body.name,
    issuedDate: new Date(req.body.issuedDate),
    status: req.body.status,
    category: req.body.category,
    subject: req.body.subject,
    conclusion: req.body.conclusion,
};

  await db.diagnosticReports.insertOne(newDiagnosticReport);
  return res.status(201).json(newDiagnosticReport);
};

const deleteById: RequestHandler = async (req: Request, res: Response) => {
  const userId = JwtHelper.getUserId(req);
  if (!userId) {
    return res.status(403).json({ message: "Invalid token" });
  }
  const id = req.params.id;

  const diagnosticReport = await db.diagnosticReports.findOne({ _id: new ObjectId(id) });
  if (diagnosticReport) {
    await db.diagnosticReports.deleteOne({ _id: new ObjectId(id) });
    return res.status(200).json({ message: "DiagnosticReport deleted successfully" });
  }
  return res.status(404).json({ message: "DiagnosticReport not found" });
};

const getAll: RequestHandler = async (req: Request, res: Response) => {
  const userId = JwtHelper.getUserId(req);
  if (!userId) {
    return res.status(403).json({ message: "Invalid token" });
  }

  const diagnosticReports = await db.diagnosticReports.find().toArray();
  return res.status(200).json(diagnosticReports);
};

const getById: RequestHandler = async (req: Request, res: Response) => {
  const userId = JwtHelper.getUserId(req);
  if (!userId) {
    return res.status(403).json({ message: "Invalid token" });
  }

  const id = req.params.id;
  const diagnosticReport = await db.diagnosticReports.findOne({ _id: new ObjectId(id) });
  if (diagnosticReport) {
    return res.status(200).json(diagnosticReport);
  }
  return res.status(404).json({ message: "DiagnosticReport not found" });
};

const updateById: RequestHandler = async (req: Request, res: Response) => {
  const { error } = updateDiagnosticReportSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const userId = JwtHelper.getUserId(req);
  if (!userId) {
    return res.status(403).json({ message: "Invalid token" });
  }

  const id = req.params.id;
  const diagnosticReport = await db.diagnosticReports.findOne({ _id: new ObjectId(id) });
  if (!diagnosticReport) {
    return res.status(404).json({ message: "DiagnosticReport not found" });
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
        if ((diagnosticReport as any)[key] && Array.isArray((diagnosticReport as any)[key])) {
          const arrayLength = (diagnosticReport as any)[key].length;
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

  const result = await db.diagnosticReports.updateOne(
    { _id: new ObjectId(id) },
    { $set: updateData }
  );

  if (result.matchedCount === 0) {
    return res.status(404).json({ message: "DiagnosticReport not found" });
  }

  const updatedDiagnosticReport = await db.diagnosticReports.findOne({ _id: new ObjectId(id) });
  return res.status(200).json(updatedDiagnosticReport);
};

export const diagnosticReportsController = {
  create,
  deleteById,
  getAll,
  getById,
  updateById,
};
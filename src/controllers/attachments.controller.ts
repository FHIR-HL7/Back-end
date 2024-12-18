import { RequestHandler, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { db } from "../models";
import { Attachment } from "../models/attachment.model";
import { JwtHelper } from "../helpers/JwtHelper";
import { createAttachmentSchema, updateAttachmentSchema } from "../validationSchemas";
import { CreateAttachmentRequest, CreateAttachmentResponse } from "../requests/attachments/create-attachment.request";

const create: RequestHandler = async (
  req: Request<{}, CreateAttachmentResponse, CreateAttachmentRequest>,
  res: Response
) => {
  const { error } = createAttachmentSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

const newAttachment: Attachment = {
    _id: new ObjectId(),
    entityId: new ObjectId(req.body.entityId),
    entityType: req.body.entityType,
    attachmentType: req.body.attachmentType,
    attachment: req.body.attachment,
    comments: req.body.comments,
};

  await db.attachments.insertOne(newAttachment);
  return res.status(201).json(newAttachment);
};

const deleteById: RequestHandler = async (req: Request, res: Response) => {
  const userId = JwtHelper.getUserId(req);
  if (!userId) {
    return res.status(403).json({ message: "Invalid token" });
  }
  const id = req.params.id;

  const attachment = await db.attachments.findOne({ _id: new ObjectId(id) });
  if (attachment) {
    await db.attachments.deleteOne({ _id: new ObjectId(id) });
    return res.status(200).json({ message: "Attachment deleted successfully" });
  }
  return res.status(404).json({ message: "Attachment not found" });
};

const getAll: RequestHandler = async (req: Request, res: Response) => {
  const userId = JwtHelper.getUserId(req);
  if (!userId) {
    return res.status(403).json({ message: "Invalid token" });
  }

  const attachments = await db.attachments.find().toArray();
  return res.status(200).json(attachments);
};

const getById: RequestHandler = async (req: Request, res: Response) => {
  const userId = JwtHelper.getUserId(req);
  if (!userId) {
    return res.status(403).json({ message: "Invalid token" });
  }

  const id = req.params.id;
  const attachment = await db.attachments.findOne({ _id: new ObjectId(id) });
  if (attachment) {
    return res.status(200).json(attachment);
  }
  return res.status(404).json({ message: "Attachment not found" });
};

const updateById: RequestHandler = async (req: Request, res: Response) => {
  const { error } = updateAttachmentSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const userId = JwtHelper.getUserId(req);
  if (!userId) {
    return res.status(403).json({ message: "Invalid token" });
  }

  const id = req.params.id;
  const attachment = await db.attachments.findOne({ _id: new ObjectId(id) });
  if (!attachment) {
    return res.status(404).json({ message: "Attachment not found" });
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
        if ((attachment as any)[key] && Array.isArray((attachment as any)[key])) {
          const arrayLength = (attachment as any)[key].length;
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

  const result = await db.attachments.updateOne(
    { _id: new ObjectId(id) },
    { $set: updateData }
  );

  if (result.matchedCount === 0) {
    return res.status(404).json({ message: "Attachment not found" });
  }

  const updatedAttachment = await db.attachments.findOne({ _id: new ObjectId(id) });
  return res.status(200).json(updatedAttachment);
};

export const attachmentsController = {
  create,
  deleteById,
  getAll,
  getById,
  updateById,
};
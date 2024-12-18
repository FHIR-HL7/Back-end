import { RequestHandler, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { db } from "../models";
import { Organization } from "../models/organization.model";
import { JwtHelper } from "../helpers/JwtHelper";
import { createOrganizationSchema, updateOrganizationSchema } from "../validationSchemas";
import { CreateOrganizationRequest, CreateOrganizationResponse } from "../requests/organizations/create-organization.request";

const create: RequestHandler = async (
  req: Request<{}, CreateOrganizationResponse, CreateOrganizationRequest>,
  res: Response
) => {
  const { error } = createOrganizationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const newOrganization: Organization = {
    _id: new ObjectId(),
    name: req.body.name,
    type: req.body.type,
    phoneNumbers: req.body.phoneNumbers,
    isActive: req.body.isActive,
    address: {
      country: req.body.address.country,
      city: req.body.address.city,
      street: req.body.address.street,
    },
    email: req.body.email,
  };

  await db.organizations.insertOne(newOrganization);
  return res.status(201).json(newOrganization);
};

const deleteById: RequestHandler = async (req: Request, res: Response) => {
  const userId = JwtHelper.getUserId(req);
  if (!userId) {
    return res.status(403).json({ message: "Invalid token" });
  }
  const id = req.params.id;

  const organization = await db.organizations.findOne({ _id: new ObjectId(id) });
  if (organization) {
    await db.organizations.deleteOne({ _id: new ObjectId(id) });
    return res.status(200).json({ message: "Organization deleted successfully" });
  }
  return res.status(404).json({ message: "Organization not found" });
};

const getAll: RequestHandler = async (req: Request, res: Response) => {
  const userId = JwtHelper.getUserId(req);
  if (!userId) {
    return res.status(403).json({ message: "Invalid token" });
  }

  const organizations = await db.organizations.find().toArray();
  return res.status(200).json(organizations);
};

const getById: RequestHandler = async (req: Request, res: Response) => {
  const userId = JwtHelper.getUserId(req);
  if (!userId) {
    return res.status(403).json({ message: "Invalid token" });
  }

  const id = req.params.id;
  const organization = await db.organizations.findOne({ _id: new ObjectId(id) });
  if (organization) {
    return res.status(200).json(organization);
  }
  return res.status(404).json({ message: "Organization not found" });
};

const updateById: RequestHandler = async (req: Request, res: Response) => {
  const { error } = updateOrganizationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const userId = JwtHelper.getUserId(req);
  if (!userId) {
    return res.status(403).json({ message: "Invalid token" });
  }

  const id = req.params.id;
  const organization = await db.organizations.findOne({ _id: new ObjectId(id) });
  if (!organization) {
    return res.status(404).json({ message: "Organization not found" });
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
        if ((organization as any)[key] && Array.isArray((organization as any)[key])) {
          const arrayLength = (organization as any)[key].length;
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

  const result = await db.organizations.updateOne(
    { _id: new ObjectId(id) },
    { $set: updateData }
  );

  if (result.matchedCount === 0) {
    return res.status(404).json({ message: "Organization not found" });
  }

  const updatedOrganization = await db.organizations.findOne({ _id: new ObjectId(id) });
  return res.status(200).json(updatedOrganization);
};

export const organizationsController = {
  create,
  deleteById,
  getAll,
  getById,
  updateById,
};
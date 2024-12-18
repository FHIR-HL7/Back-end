import { RequestHandler, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { db } from "../models";
import { Payment } from "../models/payment.model";
import { JwtHelper } from "../helpers/JwtHelper";
import { createPaymentSchema, updatePaymentSchema } from "../validationSchemas";
import { CreatePaymentRequest, CreatePaymentResponse } from "../requests/payments/create-payment.request";

const create: RequestHandler = async (
  req: Request<{}, CreatePaymentResponse, CreatePaymentRequest>,
  res: Response
) => {
  const { error } = createPaymentSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

const newPayment: Payment = {
    _id: new ObjectId(),
    encounterId: new ObjectId(req.body.encounterId),
    total: req.body.total,
    method: req.body.method,
    paymentDate: new Date(req.body.paymentDate),
    tax: req.body.tax,
};

  await db.payments.insertOne(newPayment);
  return res.status(201).json(newPayment);
};

const deleteById: RequestHandler = async (req: Request, res: Response) => {
  const userId = JwtHelper.getUserId(req);
  if (!userId) {
    return res.status(403).json({ message: "Invalid token" });
  }
  const id = req.params.id;

  const payment = await db.payments.findOne({ _id: new ObjectId(id) });
  if (payment) {
    await db.payments.deleteOne({ _id: new ObjectId(id) });
    return res.status(200).json({ message: "Payment deleted successfully" });
  }
  return res.status(404).json({ message: "Payment not found" });
};

const getAll: RequestHandler = async (req: Request, res: Response) => {
  const userId = JwtHelper.getUserId(req);
  if (!userId) {
    return res.status(403).json({ message: "Invalid token" });
  }

  const payments = await db.payments.find().toArray();
  return res.status(200).json(payments);
};

const getById: RequestHandler = async (req: Request, res: Response) => {
  const userId = JwtHelper.getUserId(req);
  if (!userId) {
    return res.status(403).json({ message: "Invalid token" });
  }

  const id = req.params.id;
  const payment = await db.payments.findOne({ _id: new ObjectId(id) });
  if (payment) {
    return res.status(200).json(payment);
  }
  return res.status(404).json({ message: "Payment not found" });
};

const updateById: RequestHandler = async (req: Request, res: Response) => {
  const { error } = updatePaymentSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const userId = JwtHelper.getUserId(req);
  if (!userId) {
    return res.status(403).json({ message: "Invalid token" });
  }

  const id = req.params.id;
  const payment = await db.payments.findOne({ _id: new ObjectId(id) });
  if (!payment) {
    return res.status(404).json({ message: "Payment not found" });
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
        if ((payment as any)[key] && Array.isArray((payment as any)[key])) {
          const arrayLength = (payment as any)[key].length;
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

  const result = await db.payments.updateOne(
    { _id: new ObjectId(id) },
    { $set: updateData }
  );

  if (result.matchedCount === 0) {
    return res.status(404).json({ message: "Payment not found" });
  }

  const updatedPayment = await db.payments.findOne({ _id: new ObjectId(id) });
  return res.status(200).json(updatedPayment);
};

export const paymentsController = {
  create,
  deleteById,
  getAll,
  getById,
  updateById,
};
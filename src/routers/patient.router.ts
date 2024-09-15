import { Router, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { Patient } from "../models/patient.model";
import {
  RegisterRequest,
  RegisterResponse,
} from "../requests/users/register.request";
import multer from "multer";
import { db } from "../models";
import { ImageHelper } from "../helpers/image.helper";
import { Jwt } from "jsonwebtoken";
import os from "os";
 
export const userRouter = Router();
 
// /api/users/register
// /api/users/login
 
userRouter.post(
  "/register",
  multer().single("image"),
  async (
    req: Request<{}, RegisterResponse, RegisterRequest>,
    res: Response
  ) => {
    const user = await db.users.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({
        message: "User already exists",
      });
    }
 
    const newUser: Patient = {
      _id: new ObjectId(),
      email: req.body.email,
      name: req.body.name,
      job: req.body.job,
      password: req.body.password,
    };
 
    if (req.file) {
      const fileName = `${newUser._id}-${req.file.originalname}`;
      await ImageHelper.saveImage(fileName, req.file.buffer);
      newUser.image = fileName;
    } else {
      newUser.image = "default-image.jpg";
    }
 
    db.users.insertOne(newUser);
 
    res.json(newUser);
  }
);
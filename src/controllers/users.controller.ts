import jwt from "jsonwebtoken";
import { RequestHandler, Request, Response } from "express";
import bcrypt from "bcrypt";
import {
    RegisterRequest,
    RegisterResponse,
} from "../requests/users/register.request";
import { db } from "../models";
import { ObjectId } from "mongodb";
import { ImageHelper } from "../helpers/image.helper";
import { User } from "../models/user.model";
import { LoginRequest } from "../requests/users/login.request";
import { secretKey } from "../statics/statics";
import { JwtHelper } from "../helpers/JwtHelper";
import { registerSchema, loginSchema, updateProfileSchema } from "../validationSchemas";

const register: RequestHandler = async (
    req: Request<{}, RegisterResponse, RegisterRequest> & { file?: Express.Multer.File },
    res: Response
) => {
    const { error } = registerSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const user = await db.users.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).json({
            message: "User already exists",
        });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser: User = {
        _id: new ObjectId(),
        email: req.body.email,
        fullName: req.body.fullName,
        password: hashedPassword,
        registrationDate: new Date(),
        image: "default-image.jpg",
    };

    if (req.file) {
        const fileName = `${newUser._id}-${req.file.originalname}`;
        await ImageHelper.saveImageAsync(fileName, req.file.buffer);
        newUser.image = fileName;
    }

    await db.users.insertOne(newUser);

    res.json(newUser);
};

const login: RequestHandler = async (
    req: Request<{}, {}, LoginRequest>,
    res
) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const user = await db.users.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password",
        });
    }
    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password",
        });
    }

    const token = jwt.sign(
        {
            email: user.email,
        },
        secretKey,
        {
            subject: user._id.toString(),
            expiresIn: "1d",
            issuer: req.headers.host,
        }
    );
    res.json({ token });
};

const getProfile: RequestHandler = async (req: Request, res: Response) => {
    const userId = JwtHelper.getUserId(req);
    if (!userId) {
        return res.status(403).json({ message: "Invalid token" });
    }

    const user = await db.users.findOne({ _id: new ObjectId(userId) });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
};

const updateProfile: RequestHandler = async (req: Request, res: Response) => {
    const { error } = updateProfileSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const userId = JwtHelper.getUserId(req);
    if (!userId) {
        return res.status(403).json({ message: "Invalid token" });
    }

    const user = await db.users.findOne({ _id: new ObjectId(userId) });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const updateData: Partial<User> = {};

    if (req.body.email) {
        updateData.email = req.body.email;
    }

    if (req.body.fullName) {
        updateData.fullName = req.body.fullName;
    }

    if (req.body.password) {
        updateData.password = await bcrypt.hash(req.body.password, 10);
    }

    if (req.file) {
        if (user.image && user.image !== "default-image.jpg") {
            await ImageHelper.deleteImage(user.image);
        }

        const fileName = `${userId}-${req.file.originalname}`;
        await ImageHelper.saveImageAsync(fileName, req.file.buffer);
        updateData.image = fileName;
    }

    if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: "Nothing to update" });
    }
    
    const result = await db.users.updateOne(
        { _id: new ObjectId(userId) },
        { $set: updateData }
    );

    if (result.matchedCount === 0) {
        return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await db.users.findOne({ _id: new ObjectId(userId) });
    res.json(updatedUser);
};

export const usersController = {
    register,
    login,
    getProfile,
    updateProfile,
};
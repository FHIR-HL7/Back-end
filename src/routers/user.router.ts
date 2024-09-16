import { Router } from "express";
import multer from "multer";
import { usersController } from "../controllers/users.controller";
import { isAuthenticate } from "../middlewares/isAuthenticated";

export const userRouter = Router();

userRouter.post(
  "/register",
  multer().single("image"),
  usersController.register
);

userRouter.post("/login", usersController.login);

userRouter.use(isAuthenticate);
const upload = multer();

userRouter.get("/profile", usersController.getProfile);
userRouter.patch("/profile", upload.single("image"), usersController.updateProfile);

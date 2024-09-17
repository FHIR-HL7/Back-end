import { Router } from "express";
import multer from "multer";
import { isAuthenticate } from "../middlewares/isAuthenticated";
import { practitionersController } from "../controllers/practitioners.controller";

export const practitionersRouter = Router();

const upload = multer();

practitionersRouter.use(isAuthenticate);

practitionersRouter
  .route("/")
  .post(upload.single("image"), practitionersController.create)
  .get(practitionersController.getAll);

practitionersRouter
  .route("/:id")
  .get(practitionersController.getById)
  .delete(practitionersController.deleteById)
  .patch(upload.single("image"), practitionersController.updateById);
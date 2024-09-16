import { Router } from "express";
import multer from "multer";
import { isAuthenticate } from "../middlewares/isAuthenticated";
import { patientsController } from "../controllers/patients.controller";

export const patientsRouter = Router();

const upload = multer();

patientsRouter.use(isAuthenticate);

patientsRouter
  .route("/")
  .post(upload.single("image"), patientsController.create)
  .get(patientsController.getAll);

patientsRouter
  .route("/:id")
  .get(patientsController.getById)
  .delete(patientsController.deleteById)
  .patch(upload.single("image"), patientsController.updateById);
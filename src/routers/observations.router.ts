import { Router } from "express";
import { observationsController } from "../controllers/observations.controller";

export const observationsRouter = Router();

observationsRouter
  .route("/")
  .post(observationsController.create)
  .get(observationsController.getAll);

observationsRouter
  .route("/:id")
  .get(observationsController.getById)
  .delete(observationsController.deleteById)
  .patch(observationsController.updateById);
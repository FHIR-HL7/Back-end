import { Router } from "express";
import { medicationsController } from "../controllers/medications.controller";

export const medicationsRouter = Router();

medicationsRouter
  .route("/")
  .post(medicationsController.create)
  .get(medicationsController.getAll);

medicationsRouter
  .route("/:id")
  .get(medicationsController.getById)
  .delete(medicationsController.deleteById)
  .patch(medicationsController.updateById);
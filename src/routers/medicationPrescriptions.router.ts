import { Router } from "express";
import { medicationPrescriptionsController } from "../controllers/medicationPrescriptions.controller";

export const medicationPrescriptionsRouter = Router();

medicationPrescriptionsRouter
  .route("/")
  .post(medicationPrescriptionsController.create)
  .get(medicationPrescriptionsController.getAll);

medicationPrescriptionsRouter
  .route("/:id")
  .get(medicationPrescriptionsController.getById)
  .delete(medicationPrescriptionsController.deleteById)
  .patch(medicationPrescriptionsController.updateById);
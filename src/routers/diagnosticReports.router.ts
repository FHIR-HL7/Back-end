import { Router } from "express";
import { diagnosticReportsController } from "../controllers/diagnosticReports.controller";

export const diagnosticReportsRouter = Router();

diagnosticReportsRouter
  .route("/")
  .post(diagnosticReportsController.create)
  .get(diagnosticReportsController.getAll);

diagnosticReportsRouter
  .route("/:id")
  .get(diagnosticReportsController.getById)
  .delete(diagnosticReportsController.deleteById)
  .patch(diagnosticReportsController.updateById);
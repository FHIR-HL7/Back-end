import { Router } from "express";
import { labTestsController } from "../controllers/labTests.controller";

export const labTestsRouter = Router();

labTestsRouter
  .route("/")
  .post(labTestsController.create)
  .get(labTestsController.getAll);

labTestsRouter
  .route("/:id")
  .get(labTestsController.getById)
  .delete(labTestsController.deleteById)
  .patch(labTestsController.updateById);
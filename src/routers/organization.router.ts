import { Router } from "express";
import { organizationsController } from "../controllers/organizations.controller";

export const organizationsRouter = Router();

organizationsRouter
  .route("/")
  .post(organizationsController.create)
  .get(organizationsController.getAll);

organizationsRouter
  .route("/:id")
  .get(organizationsController.getById)
  .delete(organizationsController.deleteById)
  .patch(organizationsController.updateById);
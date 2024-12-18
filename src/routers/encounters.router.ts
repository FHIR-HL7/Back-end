import { Router } from "express";
import { encountersController } from "../controllers/encounters.controller";

export const encountersRouter = Router();

encountersRouter
  .route("/")
  .post(encountersController.create)
  .get(encountersController.getAll);

encountersRouter
  .route("/:id")
  .get(encountersController.getById)
  .delete(encountersController.deleteById)
  .patch(encountersController.updateById);
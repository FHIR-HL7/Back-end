import { Router } from "express";
import { questionnairesController } from "../controllers/questionnaires.controller";

export const questionnairesRouter = Router();

questionnairesRouter
  .route("/")
  .post(questionnairesController.create)
  .get(questionnairesController.getAll);

questionnairesRouter
  .route("/:id")
  .get(questionnairesController.getById)
  .delete(questionnairesController.deleteById)
  .patch(questionnairesController.updateById);
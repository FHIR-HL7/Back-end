import { Router } from "express";
import { attachmentsController } from "../controllers/attachments.controller";

export const attachmentsRouter = Router();

attachmentsRouter
  .route("/")
  .post(attachmentsController.create)
  .get(attachmentsController.getAll);

attachmentsRouter
  .route("/:id")
  .get(attachmentsController.getById)
  .delete(attachmentsController.deleteById)
  .patch(attachmentsController.updateById);
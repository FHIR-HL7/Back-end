import { Router } from "express";
import { paymentsController } from "../controllers/payments.controller";

export const paymentsRouter = Router();

paymentsRouter
  .route("/")
  .post(paymentsController.create)
  .get(paymentsController.getAll);

paymentsRouter
  .route("/:id")
  .get(paymentsController.getById)
  .delete(paymentsController.deleteById)
  .patch(paymentsController.updateById);
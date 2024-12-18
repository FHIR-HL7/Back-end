import express, { json, NextFunction, Request, Response } from "express";
import { userRouter } from "./src/routers/user.router";
import path from "path";
import { patientsRouter } from "./src/routers/patients.router";
import { practitionersRouter } from "./src/routers/practitioners.router";
import { medicationsRouter } from "./src/routers/medications.router";
import { organizationsRouter } from "./src/routers/organization.router";
import { questionnairesRouter } from "./src/routers/questionnaires.router";
import { encountersRouter } from "./src/routers/encounters.router";
import { paymentsRouter } from "./src/routers/payments.router";
import { labTestsRouter } from "./src/routers/labTests.router";
import { medicationPrescriptionsRouter } from "./src/routers/medicationPrescriptions.router";
import { observationsRouter } from "./src/routers/observations.router";
import { diagnosticReportsRouter } from "./src/routers/diagnosticReports.router";
import { attachmentsRouter } from "./src/routers/attachments.router";
// import cors from "cors";

const app = express();

app.use(express.static(path.join(__dirname, "public")));

// app.use(cors()); // for allowing cross-origin requests

app.use(json()); // for parsing application/json else req.body will be {} not undefined

//#region for allowing cross-origin requests
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });
//#endregion

app.use("/api/users", userRouter);

app.use("/api/patients", patientsRouter);

app.use("/api/practitioners", practitionersRouter);

app.use("/api/medications", medicationsRouter);

app.use("/api/organizations", organizationsRouter);

app.use("/api/questionnaires", questionnairesRouter);

app.use("/api/encounters", encountersRouter);

app.use("/api/payments", paymentsRouter);

app.use("/api/labTests", labTestsRouter);

app.use("/api/medicationPrescriptions", medicationPrescriptionsRouter);

app.use("/api/observations", observationsRouter);

app.use("/api/diagnosticReports", diagnosticReportsRouter);

app.use("/api/attachments", attachmentsRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send({ message: error.message });
});

app.listen(3000, () => {
  console.log("Server is running on port http://localhost:3000");
});

// declare global {
//   namespace Express {
//     interface Request {
//       userId: string;
//     }
//   }
// }

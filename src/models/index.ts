import { patients } from "./patient.model";
import { practitioners } from "./practitioner.model";
import { attachments } from "./attachment.model";
import { organizations } from "./organization.model";
import { observations } from "./observation.model";
import { users } from "./user.model";
import { labTests } from "./labTest.model";
import { diagnosticReports } from "./diagnosticReport.model";
import { medicationPrescriptions } from "./medicationPrescription.model";
import { encounters } from "./encounter.model";
import { questionnaires } from "./questionnaire.model";
import { medications } from "./medication.model";
import { payments } from "./payment.model";

export const db = {
    patients,
    practitioners,
    attachments,
    organizations,
    observations,
    users,
    labTests,
    diagnosticReports,
    medicationPrescriptions,
    encounters,
    questionnaires,
    medications,
    payments
};
import { patients } from "./patient.model";
import { practitioner } from "./practitioner.model";
import { attachment } from "./attachment.model";
import { organization } from "./organization.model";
import { observation } from "./observation.model";
import { users } from "./user.model";
import { labTest } from "./labTest.model";
import { diagnosticReport } from "./diagnosticReport.model";
import { medicationPrescription } from "./medicationPrescription.model";
import { encounter } from "./encounter.model";
import { questionnaire } from "./questionnaire.model";
import { medication } from "./medication.model";

export const db = {
    patients,
    practitioner,
    attachment,
    organization,
    observation,
    users,
    labTest,
    diagnosticReport,
    medicationPrescription,
    encounter,
    questionnaire,
    medication
};
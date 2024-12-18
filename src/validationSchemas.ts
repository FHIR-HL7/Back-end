import Joi from "joi";
import { ObjectId } from "mongodb";

const objectId = Joi.string().custom((value, helpers) => {
    if (!ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
    }
    return value;
}, "ObjectId validation");

export const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    fullName: Joi.string().min(3).max(50).required(),
    password: Joi.string().min(6).required(),
    image: Joi.any().optional()
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

export const updateProfileSchema = Joi.object({
    email: Joi.string().email().optional(),
    fullName: Joi.string().min(3).max(50).optional(),
    password: Joi.string().min(6).optional(),
    image: Joi.any().optional()
});


export const createPatientSchema = Joi.object({
    name: Joi.object({
        first: Joi.string().required(),
        second: Joi.string().optional(),
        last: Joi.string().required()
    }).required(),
    email: Joi.string().email().required(),
    gender: Joi.string().valid("male", "female").required(),
    nationalNumber: Joi.string().required(),
    deceasedDate: Joi.date().optional(),
    phoneNumbers: Joi.array().items(Joi.string().required()).required(),
    isActive: Joi.boolean().required(),
    birthDate: Joi.date().required(),
    maritalStatus: Joi.string().valid("Single", "Married", "Divorced", "Widowed").required(),
    address: Joi.object({
        country: Joi.string().required(),
        city: Joi.string().required(),
        street: Joi.string().optional()
    }).required(),
    chronicDiseases: Joi.array().items(Joi.string()).optional(),
    insurance: Joi.object({
        insuranceCompany: Joi.string().required(),
        insuranceNumber: Joi.string().required()
    }).optional(),
    bloodType: Joi.string().valid("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-").required(),
    weight: Joi.number().required(),
    height: Joi.number().required(),
    emergencyContact: Joi.object({
        name: Joi.string().required(),
        phone: Joi.string().required()
    }).required(),
    image: Joi.any().optional()
});

export const updatePatientSchema = Joi.object({
    name: Joi.object({
        first: Joi.string().optional(),
        second: Joi.string().optional(),
        last: Joi.string().optional()
    }).optional(),
    email: Joi.string().email().optional(),
    gender: Joi.string().valid("male", "female").optional(),
    nationalNumber: Joi.string().optional(),
    deceasedDate: Joi.date().optional(),
    phoneNumbers: Joi.array().items(Joi.string().optional()).optional(),
    isActive: Joi.boolean().optional(),
    birthDate: Joi.date().optional(),
    maritalStatus: Joi.string().valid("Single", "Married", "Divorced", "Widowed").optional(),
    address: Joi.object({
        country: Joi.string().optional(),
        city: Joi.string().optional(),
        street: Joi.string().optional()
    }).optional(),
    chronicDiseases: Joi.array().items(Joi.string()).optional(),
    insurance: Joi.object({
        insuranceCompany: Joi.string().optional(),
        insuranceNumber: Joi.string().optional()
    }).optional(),
    bloodType: Joi.string().valid("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-").optional(),
    weight: Joi.number().optional(),
    height: Joi.number().optional(),
    emergencyContact: Joi.object({
        name: Joi.string().optional(),
        phone: Joi.string().optional()
    }).optional(),
    image: Joi.any().optional()
});

export const createPractitionerSchema = Joi.object({
    name: Joi.object({
        first: Joi.string().required(),
        second: Joi.string().optional(),
        last: Joi.string().required()
    }).required(),
    gender: Joi.string().valid("Male", "Female").required(),
    image: Joi.string().optional(),
    specialty: Joi.string().required(),
    role: Joi.string().required(),
    phoneNumbers: Joi.array().items(Joi.string().required()).required(),
    email: Joi.string().email().required(),
    birthDate: Joi.date().required(),
    nationalNumber: Joi.string().required(),
    isActive: Joi.boolean().required(),
    address: Joi.object({
        country: Joi.string().required(),
        city: Joi.string().required(),
        street: Joi.string().optional()
    }).required(),
    practiceLicense: Joi.string().required(),
    qualifications: Joi.array().items(Joi.string().required()).required()
});

export const updatePractitionerSchema = Joi.object({
    name: Joi.object({
        first: Joi.string().optional(),
        second: Joi.string().optional(),
        last: Joi.string().optional()
    }).optional(),
    gender: Joi.string().valid("Male", "Female").optional(),
    image: Joi.string().optional(),
    specialty: Joi.string().optional(),
    role: Joi.string().optional(),
    phoneNumbers: Joi.array().items(Joi.string().optional()).optional(),
    email: Joi.string().email().optional(),
    birthDate: Joi.date().optional(),
    nationalNumber: Joi.string().optional(),
    isActive: Joi.boolean().optional(),
    address: Joi.object({
        country: Joi.string().optional(),
        city: Joi.string().optional(),
        street: Joi.string().optional()
    }).optional(),
    practiceLicense: Joi.string().optional(),
    qualifications: Joi.array().items(Joi.string().optional()).optional()
});

export const createOrganizationSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    type: Joi.string().valid("Hospital", "Clinic", "Pharmacy", "Laboratory").required(),
    phoneNumbers: Joi.array().items(Joi.string().required()).required(),
    isActive: Joi.boolean().required(),
    address: Joi.object({
        country: Joi.string().required(),
        city: Joi.string().required(),
        street: Joi.string().optional()
    }).required(),
    email: Joi.string().email().required()
});

export const updateOrganizationSchema = Joi.object({
    name: Joi.string().min(3).max(50).optional(),
    type: Joi.string().valid("Hospital", "Clinic", "Pharmacy", "Laboratory").optional(),
    phoneNumbers: Joi.array().items(Joi.string().optional()).optional(),
    isActive: Joi.boolean().optional(),
    address: Joi.object({
        country: Joi.string().optional(),
        city: Joi.string().optional(),
        street: Joi.string().optional()
    }).optional(),
    email: Joi.string().email().optional()
});

export const createMedicationSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    description: Joi.string().optional(),
    code: Joi.string().required(),
    manufacturer: Joi.string().required(),
    form: Joi.string().required(),
    amount: Joi.number().required(),
    unit: Joi.string().required(),
    isActive: Joi.boolean().required(),
    expirationDate: Joi.date().required()
});

export const updateMedicationSchema = Joi.object({
    name: Joi.string().min(3).max(50).optional(),
    description: Joi.string().optional(),
    code: Joi.string().optional(),
    manufacturer: Joi.string().optional(),
    form: Joi.string().optional(),
    amount: Joi.number().optional(),
    unit: Joi.string().optional(),
    isActive: Joi.boolean().optional(),
    expirationDate: Joi.date().optional()
});

export const createQuestionnaireSchema = Joi.object({
    _id: objectId.required(),
    contributedPatientIds: Joi.array().items(objectId.required()).optional(),
    name: Joi.string().required(),
    description: Joi.string().optional(),
    questions: Joi.array().items(
        Joi.object({
            question: Joi.string().required(),
            type: Joi.string().valid("text", "radio", "checkbox").required(),
            options: Joi.array().items(Joi.string()).optional()
        }).required()
    ).required(),
    purpose: Joi.string().optional(),
    code: Joi.string().required(),
    createdAt: Joi.date().required(),
    version: Joi.number().optional(),
    url: Joi.string().optional(),
    status: Joi.string().valid("draft", "active", "retired", "unknown").required(),
    effectivePeriod: Joi.object({
        start: Joi.date().required(),
        end: Joi.date().optional()
    }).required(),
    approvalDate: Joi.date().optional(),
    lastModified: Joi.date().optional()
});

export const updateQuestionnaireSchema = Joi.object({
    _id: objectId.optional(),
    contributedPatientIds: Joi.array().items(objectId.optional()).optional(),
    name: Joi.string().optional(),
    description: Joi.string().optional(),
    questions: Joi.array().items(
        Joi.object({
            question: Joi.string().optional(),
            type: Joi.string().valid("text", "radio", "checkbox").optional(),
            options: Joi.array().items(Joi.string()).optional()
        }).optional()
    ).optional(),
    purpose: Joi.string().optional(),
    code: Joi.string().optional(),
    createdAt: Joi.date().optional(),
    version: Joi.number().optional(),
    url: Joi.string().optional(),
    status: Joi.string().valid("draft", "active", "retired", "unknown").optional(),
    effectivePeriod: Joi.object({
        start: Joi.date().optional(),
        end: Joi.date().optional()
    }).optional(),
    approvalDate: Joi.date().optional(),
    lastModified: Joi.date().optional()
});

export const createEncounterSchema = Joi.object({
    _id: objectId.required(),
    patientId: objectId.required(),
    practitionerId: objectId.required(),
    organizationId: objectId.required(),
    status: Joi.string().valid("planned", "arrived", "triaged", "in-progress", "onleave", "finished", "cancelled").required(),
    type: Joi.string().valid("consultation", "follow-up", "emergency", "routine").required(),
    priority: Joi.string().valid("routine", "urgent", "asap", "stat").required(),
    reason: Joi.string().optional(),
    period: Joi.object({
        start: Joi.date().required(),
        end: Joi.date().optional()
    }).required(),
    patientInstructions: Joi.string().optional()
});

export const updateEncounterSchema = Joi.object({
    _id: objectId.optional(),
    patientId: objectId.optional(),
    practitionerId: objectId.optional(),
    organizationId: objectId.optional(),
    status: Joi.string().valid("planned", "arrived", "triaged", "in-progress", "onleave", "finished", "cancelled").optional(),
    type: Joi.string().valid("consultation", "follow-up", "emergency", "routine").optional(),
    priority: Joi.string().valid("routine", "urgent", "asap", "stat").optional(),
    reason: Joi.string().optional(),
    period: Joi.object({
        start: Joi.date().optional(),
        end: Joi.date().optional()
    }).optional(),
    patientInstructions: Joi.string().optional()
});

export const createPaymentSchema = Joi.object({
    _id: objectId.required(),
    encounterId: objectId.required(),
    total: Joi.number().positive().required(),
    method: Joi.string().valid("cash", "check", "card", "bank", "other").required(),
    paymentDate: Joi.date().required(),
    tax: Joi.number().positive().required()
});

export const updatePaymentSchema = Joi.object({
    _id: objectId.optional(),
    encounterId: objectId.optional(),
    total: Joi.number().positive().optional(),
    method: Joi.string().valid("cash", "check", "card", "bank", "other").optional(),
    paymentDate: Joi.date().optional(),
    tax: Joi.number().positive().optional()
});

export const createLabTestSchema = Joi.object({
    _id: objectId.required(),
    patientId: objectId.required(),
    practitionerId: objectId.required(),
    organizationId: objectId.required(),
    status: Joi.string().valid("requested", "completed", "in-progress", "cancelled").required(),
    testType: Joi.string().required(),
    priority: Joi.string().valid("routine", "urgent", "asap", "stat").required(),
    sampleType: Joi.string().valid("blood", "urine", "saliva", "stool", "semen", "other").required(),
    reason: Joi.string().optional(),
    testDate: Joi.date().required(),
    result: Joi.string().optional(),
    resultStatus: Joi.string().valid("normal", "abnormal", "in-progress").optional(),
    resultComments: Joi.string().optional(),
    price: Joi.number().positive().required()
});

export const updateLabTestSchema = Joi.object({
    _id: objectId.optional(),
    patientId: objectId.optional(),
    practitionerId: objectId.optional(),
    organizationId: objectId.optional(),
    status: Joi.string().valid("requested", "completed", "in-progress", "cancelled").optional(),
    testType: Joi.string().optional(),
    priority: Joi.string().valid("routine", "urgent", "asap", "stat").optional(),
    sampleType: Joi.string().valid("blood", "urine", "saliva", "stool", "semen", "other").optional(),
    reason: Joi.string().optional(),
    testDate: Joi.date().optional(),
    result: Joi.string().optional(),
    resultStatus: Joi.string().valid("normal", "abnormal", "in-progress").optional(),
    resultComments: Joi.string().optional(),
    price: Joi.number().positive().optional()
});

export const createMedicationPrescriptionSchema = Joi.object({
    _id: objectId.required(),
    encounterId: objectId.required(),
    medicationId: objectId.required(),
    dosage: Joi.string().required(),
    dosageInstruction: Joi.string().required(),
    duration: Joi.string().required(),
    refills: Joi.number().integer().min(0).required(),
    quantity: Joi.number().positive().required(),
    frequency: Joi.string().required()
});

export const updateMedicationPrescriptionSchema = Joi.object({
    _id: objectId.optional(),
    encounterId: objectId.optional(),
    medicationId: objectId.optional(),
    dosage: Joi.string().optional(),
    dosageInstruction: Joi.string().optional(),
    duration: Joi.string().optional(),
    refills: Joi.number().integer().min(0).optional(),
    quantity: Joi.number().positive().optional(),
    frequency: Joi.string().optional()
});

export const createDiagnosticReportSchema = Joi.object({
    _id: objectId.required(),
    patientId: objectId.required(),
    practitionerId: objectId.required(),
    organizationId: objectId.required(),
    encounterId: objectId.required(),
    labTestIds: Joi.array().items(objectId.required()).required(),
    name: Joi.string().required(),
    issuedDate: Joi.date().required(),
    status: Joi.string().valid("registered", "partial", "preliminary", "final").required(),
    category: Joi.string().required(),
    subject: Joi.string().required(),
    conclusion: Joi.string().optional()
});

export const updateDiagnosticReportSchema = Joi.object({
    _id: objectId.optional(),
    patientId: objectId.optional(),
    practitionerId: objectId.optional(),
    organizationId: objectId.optional(),
    encounterId: objectId.optional(),
    labTestIds: Joi.array().items(objectId.optional()).optional(),
    name: Joi.string().optional(),
    issuedDate: Joi.date().optional(),
    status: Joi.string().valid("registered", "partial", "preliminary", "final").optional(),
    category: Joi.string().optional(),
    subject: Joi.string().optional(),
    conclusion: Joi.string().optional()
});

export const createObservationSchema = Joi.object({
    _id: objectId.required(),
    diagnosticReportId: objectId.required(),
    interpretation: Joi.string().required(),
    code: Joi.string().required(),
    value: Joi.string().required(),
    unit: Joi.string().required()
});

export const updateObservationSchema = Joi.object({
    _id: objectId.optional(),
    diagnosticReportId: objectId.optional(),
    interpretation: Joi.string().optional(),
    code: Joi.string().optional(),
    value: Joi.string().optional(),
    unit: Joi.string().optional()
});

export const createAttachmentSchema = Joi.object({
    _id: objectId.required(),
    entityId: objectId.required(),
    entityType: Joi.string().valid("LabTest", "DiagnosticReport", "MedicationPrescription", "Encounter", "Patient", "Practitioner", "Organization").required(),
    attachmentType: Joi.string().valid("image", "pdf", "doc", "other").required(),
    attachment: Joi.string().required(),
    comments: Joi.string().optional()
});

export const updateAttachmentSchema = Joi.object({
    _id: objectId.optional(),
    entityId: objectId.optional(),
    entityType: Joi.string().valid("LabTest", "DiagnosticReport", "MedicationPrescription", "Encounter", "Patient", "Practitioner", "Organization").optional(),
    attachmentType: Joi.string().valid("image", "pdf", "doc", "other").optional(),
    attachment: Joi.string().optional(),
    comments: Joi.string().optional()
});
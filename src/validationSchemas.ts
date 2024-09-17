import Joi from "joi";

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
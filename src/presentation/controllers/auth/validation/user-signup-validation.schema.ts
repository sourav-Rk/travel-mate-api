import {z} from 'zod';

import { emailRegex } from '../../../../shared/validations/email.validation';
import { genderSchema } from '../../../../shared/validations/gender.validation';
import { firstNameSchema, lastNameSchema } from '../../../../shared/validations/name.validation';
import { passwordSchema } from '../../../../shared/validations/password.validation';
import { phoneNumberSchema } from '../../../../shared/validations/phone.validation';

const clientSchema = z.object({
    firstName : firstNameSchema,
    lastName : lastNameSchema,
    phone : phoneNumberSchema,
    password : passwordSchema,
    gender : genderSchema,
    role : z.literal("client"),
    email : z
    .string()
    .regex(emailRegex,{message : "invalid email format"})
});

const vendorSchema = z.object({
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  phone: phoneNumberSchema,
  password: passwordSchema,
  role: z.literal("vendor"),
  email: z.string().regex(emailRegex, { message: "invalid email format" }),
  agencyName: z
    .string()
    .min(2, { message: "Agency name must be at least 2 characters" })
    .max(100, { message: "Agency name must not exceed 100 characters" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" })
    .max(500, { message: "Description must not exceed 500 characters" })
});



export const userSchemas = {
    client : clientSchema,
    vendor : vendorSchema,
    guide : vendorSchema
};

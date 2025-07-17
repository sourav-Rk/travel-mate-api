import { z } from "zod";

export const nameRegex = /^[a-zA-Z]+$/;

export const firstNameSchema = z
  .string()
  .regex(nameRegex, { message: "first name should only contain letters" })
  .min(2, { message: "First name must be at least 2 characters" })
  .max(50, { message: "First name must not exceed 50 characters" });

export const lastNameSchema = z
  .string()
  .regex(nameRegex, { message: "Last name should only contain letters" })
  .min(1, { message: "Last name must be at least 1 character" })
  .max(50, { message: "Last name must not exceed 50 characters" });

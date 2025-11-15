import { z } from "zod";

export const genderSchema = z.enum(["male", "female", "others"]);

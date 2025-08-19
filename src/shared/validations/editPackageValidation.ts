import { z } from "zod";

// ------------------ Basic Details ------------------
export const basicDetailsSchemaEdit = z.object({
  packageName: z
    .string()
    .min(3, "Package name must be at least 3 characters")
    .max(100, "Package name must not exceed 100 characters"),

  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(150, "Title must not exceed 150 characters"),


  description: z
    .string()
    .min(50, "Description must be at least 50 characters")
    .max(2000),

  category: z.enum([
    "adventure",
    "cultural",
    "nature",
    "beach",
    "mountain",
    "wildlife",
    "heritage",
  ]),

  tags: z.array(z.string().min(1)).min(1).max(10),

  meetingPoint: z
    .string()
    .min(10, "Meeting point must be at least 10 characters")
    .max(200),

  images: z
    .array(z.string().url())
    .min(1, "At least one image is required")
    .max(10, "Maximum 10 images allowed"),

  maxGroupSize: z.number().int().min(10).max(50),

  price: z.number().min(500).max(1000000),

  cancellationPolicy: z.string().min(20).max(1000),

  termsAndConditions: z.string().min(50).max(2000),

  startDate: z
    .string()
    .transform((val) => new Date(val))
    .refine((d) => !isNaN(d.getTime()), {
      message: "Invalid date format",
    }),

  endDate: z
    .string()
    .transform((val) => new Date(val))
    .refine((d) => !isNaN(d.getTime()), {
      message: "Invalid date format",
    }),

  duration: z.object({
    days: z.number().min(1).max(30),
    nights: z.number().min(0).max(29),
  }),

  inclusions: z.array(z.string().min(1)).min(1).max(20),

  exclusions: z.array(z.string().min(1)).max(20),
});

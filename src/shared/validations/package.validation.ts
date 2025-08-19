import { z } from "zod";

// ------------------ Basic Details ------------------
export const basicDetailsSchema = z
  .object({
    packageName: z
      .string()
      .min(3, "Package name must be at least 3 characters")
      .max(100, "Package name must not exceed 100 characters"),

    title: z
      .string()
      .min(5, "Title must be at least 5 characters")
      .max(150, "Title must not exceed 150 characters"),

    slug: z
      .string()
      .regex(
        /^[a-z0-9-]+$/,
        "Slug can only contain lowercase letters, numbers, and hyphens"
      )
      .min(3)
      .max(100),

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
      .transform((val) => new Date(val)) // convert string -> Date
      .refine((d) => !isNaN(d.getTime()), {
        message: "Invalid date format",
      })
      .refine((d) => d >= new Date(), {
        message: "Start date cannot be in the past",
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

// ------------------ Activities ------------------
export const activitySchema = z.object({
  name: z.string().min(3).max(100),
  dayNumber: z.number().int().min(1),
  description: z.string().max(500).optional(),
  duration: z.string().max(50).optional(),
  category: z
    .enum([
      "sightseeing",
      "adventure",
      "cultural",
      "nature",
      "water-sports",
      "food",
      "shopping",
      "relaxation",
    ])
    .optional(),
  priceIncluded: z.boolean(),
});

// ------------------ Day Schema ------------------
export const daySchema = z.object({
  dayNumber: z.number().int().min(1),
  title: z.string().min(5).max(100),
  description: z.string().min(20).max(1000),
  accommodation: z.string().max(200).optional(),
  transfers: z.array(z.string().min(1)).max(10).optional(),
  meals: z.object({
    breakfast: z.boolean(),
    lunch: z.boolean(),
    dinner: z.boolean(),
  }),
  activities: z.array(activitySchema).max(10).optional(),
});

// ------------------ Itinerary Schema ------------------
export const itinerarySchema = z
  .array(daySchema)
  .min(1)
  .max(30)
  .superRefine((days, ctx) => {
    const sorted = [...days].sort((a, b) => a.dayNumber - b.dayNumber);
    for (let i = 0; i < sorted.length; i++) {
      if (sorted[i].dayNumber !== i + 1) {
        ctx.addIssue({
          code: "custom",
          message: `Day ${i + 1} is missing or day numbers are not consecutive`,
          path: [i, "dayNumber"],
        });
      }
    }
  });

// ------------------ Main Package Schema ------------------
export const packageFormSchema = z.object({
  basicDetails: basicDetailsSchema,
  itinerary: itinerarySchema,
});

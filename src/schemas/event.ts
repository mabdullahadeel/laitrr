import * as z from "zod";

export const eventScheme = z.object({
  title: z
    .string()
    .min(3, {
      message: "Title must be at least 3 characters long",
    })
    .max(250, {
      message: "Title must be at most 250 characters long",
    }),
  description: z.any().optional(),
  type: z.string().optional(),
  start_date: z.date(),
  resource_url: z
    .string()
    .regex(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/, {
      message: "Invalid URL",
    })
    .optional(),
});

export type EventFormValues = z.infer<typeof eventScheme>;

export const eventAnnouncementSchema = z.object({
  title: z
    .string()
    .min(3, {
      message: "Title must be at least 3 characters long",
    })
    .max(255, {
      message: "Title must be at most 255 characters long",
    }),
  description: z.any().optional(),
});

export type EventAnnouncementFormValues = z.infer<
  typeof eventAnnouncementSchema
>;

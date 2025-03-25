import { z } from "zod"

const VisitSchema = z.object({
  isVisit: z.literal(true),
  region_id: z.string(),
  customer_id: z.string(),
  shipping_address: z.object({
    address_1: z.string().min(1, "Address line 1 cannot be empty"),
    address_2: z.string().optional(),
    city: z.string().min(1, "City cannot be empty"),
    country_code: z.string().min(1, "Country code cannot be empty"),
    postal_code: z
      .string()
      .min(1, "Postal code cannot be empty")
      .regex(
        /^[A-Za-z0-9\s-]+$/,
        "Postal code can only contain letters, numbers, spaces and hyphens"
      )
      .max(10, "Postal code cannot be longer than 10 characters"),
    phone: z.string().optional(),
  }),
  fulfillment_provider_id: z.string().optional(),
})

const NonVisitSchema = z.object({
  isVisit: z.literal(false),
  region_id: z.string(),
  customer_id: z.string(),
  shipping_address: z.object({
    address_1: z.string().min(1, "Address line 1 cannot be empty"),
    address_2: z.string().optional(),
    city: z.string().min(1, "City cannot be empty"),
    country_code: z.string().min(1, "Country code cannot be empty"),
    postal_code: z
      .string()
      .min(1, "Postal code cannot be empty")
      .regex(
        /^[A-Za-z0-9\s-]+$/,
        "Postal code can only contain letters, numbers, spaces and hyphens"
      )
      .max(10, "Postal code cannot be longer than 10 characters"),
    phone: z.string().optional(),
  }),
  fulfillment_provider_id: z.string().optional(),
  variants: z
    .record(
      z.object({
        quantity: z.number().optional(),
      })
    )
    .refine(
      (variants) =>
        Object.values(variants).some(
          (variant) => variant.quantity && variant.quantity > 0
        ),
      {
        message: "At least one variant must have a quantity greater than 0",
      }
    ),
})

export const OrderCreateSchema = z.discriminatedUnion("isVisit", [
  NonVisitSchema,
  VisitSchema,
])

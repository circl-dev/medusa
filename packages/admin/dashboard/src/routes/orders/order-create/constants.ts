import { z } from "zod"

const VisitSchema = z.object({
  isVisit: z.literal(true),
  region_id: z.string(),
  customer_id: z.string(),
  shipping_address: z.object({
    address_1: z.string(),
    address_2: z.string().optional(),
    city: z.string(),
    country_code: z.string(),
    postal_code: z.string(),
    phone: z.string().optional(),
  }),
})

const NonVisitSchema = z.object({
  isVisit: z.literal(false),
  region_id: z.string(),
  customer_id: z.string(),
  shipping_address: z.object({
    address_1: z.string(),
    address_2: z.string().optional(),
    city: z.string(),
    country_code: z.string(),
    postal_code: z.string(),
    phone: z.string().optional(),
  }),
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

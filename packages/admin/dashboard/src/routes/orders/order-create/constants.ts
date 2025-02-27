import { z } from "zod"

const VisitSchema = z.object({
  isVisit: z.literal(true),
  shipping_address: z.string(),
})

const NonVisitSchema = z.object({
  isVisit: z.literal(false),
  products: z.array(
    z.object({
      variant_id: z.string(),
      quantity: z.number(),
    })
  ),
  shipping_address: z.string(),
  currency_code: z.string().optional(),
})

export const OrderCreateSchema = z.discriminatedUnion("isVisit", [
  VisitSchema,
  NonVisitSchema,
])

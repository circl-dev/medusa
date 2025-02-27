import { z } from "zod";
import { OrderCreateSchema } from "./constants";

export type OrderCreateSchemaType = z.infer<typeof OrderCreateSchema>;

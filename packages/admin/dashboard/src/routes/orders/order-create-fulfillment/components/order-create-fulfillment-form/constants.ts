import { z } from "zod"

export const CreateFulfillmentSchema = z.object({
  quantity: z.record(z.string(), z.number()),
  location_id: z.string(),
  shipping_option_id: z.string().optional(),
  send_notification: z.boolean().optional(),
})

export async function geocodeAddress(
  address: string
): Promise<{ lat?: number; lng?: number }> {
  try {
    const query = encodeURIComponent(address)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`,
      {
        headers: {
          "User-Agent": "MedusaJS Admin Order Creation", // Nominatim requires a User-Agent
        },
      }
    )
    const data = await response.json()
    console.log("DATA", data)
    if (data && data[0]) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      }
    }
    return {}
  } catch (error) {
    console.error("Geocoding failed:", error)
    return {}
  }
}

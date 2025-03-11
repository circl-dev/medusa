import { HttpTypes } from "@medusajs/types"
import { Container, Heading } from "@medusajs/ui"
import { Map } from "../../../../../components/map/Map"

type OrderMapSectionProps = {
  order: HttpTypes.AdminOrder & {
    metadata: {
      coordinates?: {
        lat: number
        lng: number
      }
    }
  }
}

type OrderMetadata = {
  coordinates: OrderMetadataCoordinates
}
type OrderMetadataCoordinates = {
  lat: number
  lng: number
}

const Header = () => {
  return (
    <div className="flex items-center justify-between px-6 py-4">
      <Heading level="h2">Map</Heading>
    </div>
  )
}

export const OrderMapSection = ({ order }: OrderMapSectionProps) => {
  console.log("ORDER", order)
  const fulfillments = order.fulfillments?.filter((f) => !f.canceled_at)
  let pickupLocation
  if (
    fulfillments &&
    fulfillments.length > 0 &&
    fulfillments[0].data !== undefined &&
    Array.isArray(fulfillments[0].data) &&
    fulfillments[0].data.length > 0
  ) {
    const fulfillment = fulfillments[0].data[0] as Record<string, unknown>
    if (Array.isArray(fulfillment.tasks) && fulfillment.tasks.length > 0) {
      const task = fulfillment.tasks[0] as Record<string, any>
      pickupLocation = task.pickupLocation?.coordinates
    }
  }
  console.log("PICKUP LOCATION", pickupLocation)
  return (
    <Container className="divide-y p-0">
      <Header />
      <div className="rounded-md p-4">
        {order.metadata?.coordinates && (
          <Map
            secondaryCoordinates={
              pickupLocation
                ? [pickupLocation.lat, pickupLocation.lng]
                : undefined
            }
            coordinates={[
              (order.metadata as OrderMetadata).coordinates.lat,
              (order.metadata as OrderMetadata).coordinates.lng,
            ]}
          />
        )}
      </div>
    </Container>
  )
}

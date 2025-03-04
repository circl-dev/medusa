import { HttpTypes } from "@medusajs/types"
import { Container, Heading } from "@medusajs/ui"
import { Map } from "../../../../../components/map/Map"

type OrderMapSectionProps = {
  order: HttpTypes.AdminOrder & {
    metadata: {
      coordinates?: {
        lat: number
        lon: number
      }
    }
  }
}

type OrderMetadata = {
  coordinates: OrderMetadataCoordinates
}
type OrderMetadataCoordinates = {
  lat: number
  lon: number
}

const Header = () => {
  return (
    <div className="flex items-center justify-between px-6 py-4">
      <Heading level="h2">Map</Heading>
    </div>
  )
}

export const OrderMapSection = ({ order }: OrderMapSectionProps) => {
  return (
    <Container className="divide-y p-0">
      <Header />
      <div className="rounded-md p-4">
        {order.metadata?.coordinates && (
            <Map
            coordinates={[
                (order.metadata as OrderMetadata).coordinates.lat,
                (order.metadata as OrderMetadata).coordinates.lon,
            ]}
            />
        )}
      </div>
    </Container>
  )
}

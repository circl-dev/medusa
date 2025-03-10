import { HttpTypes } from "@medusajs/types"
import { Button, Container, Heading, Label, Text, toast } from "@medusajs/ui"
import {
  useReservationItems,
  useStockLocations,
} from "../../../../../hooks/api"
import { useMemo } from "react"
import { useMutation } from "@tanstack/react-query"
import { sdk } from "../../../../../lib/client"

type OrderCirclDMSSectionProps = {
  order: HttpTypes.AdminOrder & {
    metadata: {
      coordinates?: {
        lat: number
        lng: number
      }
      circl_dms?: {
        status: string
      }
    }
  }
}

type CreateCirclDMSJobInput = {
  warehouse: {
    fullAddress: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  deliver: {
    fullAddress: string
    coordinates: {
      lat: number
      lng: number
    }
  }
}

const Header = () => {
  return (
    <div className="flex items-center justify-between px-6 py-4">
      <Heading level="h2">Circl DMS</Heading>
    </div>
  )
}

export const OrderCirclDMSSection = ({ order }: OrderCirclDMSSectionProps) => {
  const { stock_locations } = useStockLocations()
  const { reservations } = useReservationItems(
    {
      line_item_id: order?.items?.map((i) => i.id),
    },
    { enabled: Array.isArray(order?.items) }
  )
  const locationMaps = useMemo(() => {
    const locations: { [key: string]: HttpTypes.AdminReservation[] } = {}
    if (reservations && stock_locations) {
      reservations.forEach((r) => {
        const location = stock_locations.find((l) => l.id === r.location_id)
        if (location) {
          if (locations[r.location_id]) {
            locations[r.location_id].push(r)
          } else {
            locations[r.location_id] = [r]
          }
        }
      })
    }
    return locations
  }, [reservations, stock_locations])

  const { mutate } = useMutation<any, Error, CreateCirclDMSJobInput>({
    mutationFn: (body: CreateCirclDMSJobInput) =>
      sdk.client.fetch(`/admin/dms/create`, {
        method: "POST",
        body,
      }),
    onSuccess: (data) => {
      toast.success("Circl DMS job created")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  return (
    <Container className="divide-y p-0">
      <Header />
      <div className="rounded-md p-4">
        <div className="flex flex-col gap-y-4">
          <div className="flex flex-row items-center justify-between">
            <Label className="text-gray-500">Pickup</Label>
            <Label className="text-gray-500">Num. Items</Label>
          </div>
          <div className="flex flex-col gap-y-4">
            {locationMaps &&
              stock_locations &&
              Object.keys(locationMaps).map((key) => {
                const location = stock_locations.find((l) => l.id === key)
                return (
                  <div
                    key={key}
                    className="flex flex-row items-center justify-between"
                  >
                    <Text
                      size="small"
                      leading="compact"
                      weight="plus"
                      className="text-ui-fg-base"
                    >
                      {location?.name}
                    </Text>
                    <Text
                      size="small"
                      leading="compact"
                      weight="plus"
                      className="text-ui-fg-base"
                    >
                      {locationMaps[key].length}
                    </Text>
                  </div>
                )
              })}
          </div>
          <Label className="text-gray-500">Delivery</Label>
          {order && order.shipping_address && (
            <div className="flex flex-row items-center justify-between">
              <Text
                size="small"
                leading="compact"
                weight="plus"
                className="text-ui-fg-base"
              >
                {order.shipping_address?.address_1}
              </Text>
              {order.metadata && order.metadata.coordinates && (
                <Text
                  size="small"
                  leading="compact"
                  weight="plus"
                  className="text-ui-fg-base"
                >
                  ({order.metadata?.coordinates?.lat?.toFixed(3)}{" "}
                  {order.metadata?.coordinates?.lng?.toFixed(3)})
                </Text>
              )}
            </div>
          )}
          <div className="mt-8 flex flex-row items-center justify-between">
            {order.metadata && !order.metadata.circl_dms && (
              <>
                <Text
                  size="base"
                  leading="compact"
                  weight="plus"
                  className="text-ui-fg-base text-gray-500"
                >
                  Job has not been created
                </Text>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => {
                    mutate({
                      warehouse: {
                        fullAddress: order.shipping_address?.address_1 || "",
                      },
                      deliver: {
                        fullAddress: order.shipping_address?.address_1 || "",
                        coordinates: {
                          lat: order.metadata.coordinates?.lat || 0,
                          lng: order.metadata.coordinates?.lng || 0,
                        },
                      },
                    })
                  }}
                >
                  Send to Circl
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </Container>
  )
}

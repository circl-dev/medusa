import { HttpTypes } from "@medusajs/types"
import { Button, Container, Heading, Label, Text, toast } from "@medusajs/ui"
import {
  useReservationItems,
  useStockLocations,
} from "../../../../../hooks/api"
import { useMemo } from "react"
import { useMutation } from "@tanstack/react-query"
import { sdk } from "../../../../../lib/client"
import { CirclFulfillment, OrderStatus } from "../../../common/status"

type TestEventInput = {
  order_id: string
  status: string
}
type OrderCirclDMSSectionProps = {
  handleRefresh: () => void
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

export const OrderCirclDMSSection = ({
  order,
  handleRefresh,
}: OrderCirclDMSSectionProps) => {
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

  const { mutate } = useMutation<any, Error, TestEventInput>({
    mutationFn: (body: TestEventInput) =>
      sdk.client.fetch(`/admin/dms/refresh`, {
        method: "POST",
        body,
      }),
    onSuccess: (data) => {
      console.log("Done!")
      handleRefresh()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  console.log(order.metadata)
  return (
    <Container className="divide-y p-0">
      <Header />
      <div className="flex flex-col gap-4 rounded-md p-4">
        <div className="flex items-center justify-between gap-2">
          <Label>Job ID</Label>
          <Text
            size="small"
            leading="compact"
            weight="plus"
            className="text-gray-500"
          >
            {(order.metadata?.fulfillment as CirclFulfillment)?.id}
          </Text>
        </div>
        <div className="flex items-center justify-between gap-2">
          <Label>Hash</Label>
          <Text
            size="small"
            leading="compact"
            weight="plus"
            className="text-gray-500"
          >
            {(order.metadata?.fulfillment as CirclFulfillment)?.hash}
          </Text>
        </div>
        <div className="flex items-center justify-between gap-2">
          <Label>Status</Label>
          <Text
            size="small"
            leading="compact"
            weight="plus"
            className="text-gray-500"
          >
            {<OrderStatus order={order} />}
          </Text>
        </div>
      </div>
      <div className="flex flex-row justify-end gap-4 rounded-md p-4">
        {(order.metadata?.fulfillment as CirclFulfillment)?.status !=
          "job.scheduled" && (
          <Button
            onClick={() =>
              mutate({ order_id: order.id, status: "job.scheduled" })
            }
            variant="secondary"
          >
            Mark as Scheduled
          </Button>
        )}

        {(order.metadata?.fulfillment as CirclFulfillment)?.status !=
          "job.routeStarted" && (
          <Button 
            variant="secondary"
            onClick={() =>
              mutate({ order_id: order.id, status: "job.routeStarted" })
            }
          >
            Mark as Route Started
          </Button>
        )}

        {(order.metadata?.fulfillment as CirclFulfillment)?.status !=
          "job.completed" && (
          <Button
            variant="secondary"
            onClick={() =>
              mutate({ order_id: order.id, status: "job.completed" })
            }
          >
            Mark as Completed
          </Button>
        )}
      </div>
    </Container>
  )
}

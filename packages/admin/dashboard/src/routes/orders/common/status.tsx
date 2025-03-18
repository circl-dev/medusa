import { AdminOrder } from "@medusajs/types"
import { StatusCell } from "../../../components/table/table-cells/common/status-cell"
import { useTranslation } from "react-i18next"
import { StatusBadge } from "@medusajs/ui"
interface OrderStatusProps {
  order: AdminOrder & {
    metadata: {
      fulfillment?: CirclFulfillment
    }
  }
}

type OrderStatusType = {
  VISIT_NOT_FULFILLED: "visit_not_fulfilled"
  JOB_CREATED: "job_created"
  JOB_SCHEDULED: "job_scheduled"
  JOB_COMPLETED: "job_completed"
  JOB_CANCELLED: "job_cancelled"
  JOB_ROUTE_STARTED: "job_route_started"
  JOB_FAILED: "job_failed"
}

interface OrderCustomMetadata {
  is_visit_fulfilled?: boolean
  is_visit?: boolean
  circl_job?: {
    status: string
  }
  fulfillment?: CirclFulfillment
}

export type CirclFulfillment = {
  id: string
  hash: string
  tasks: {
    id: string
  }[]
  status: string
  location: {
    coordinates: {
      lat: number
      lng: number
    }
    fullAddress: string
  }
}

const parseOrderStatus = (
  order: AdminOrder
): {
  color: "orange" | "green" | "red"
  label: string
} => {
  const metadata = order.metadata as OrderCustomMetadata
  if (metadata?.fulfillment) {
    if (metadata.fulfillment.status == "job.created") {
      return {
        color: "green",
        label: "orders.circl_status.job_created",
      }
    } else if (metadata.fulfillment.status == "job.scheduled") {
      return {
        color: "orange",
        label: "orders.circl_status.job_scheduled",
      }
    } else if (metadata.fulfillment.status == "job.routeStarted") {
      return {
        color: "orange",
        label: "orders.circl_status.job_route_started",
      }
    } else if (metadata.fulfillment.status == "job.failed") {
      return {
        color: "red",
        label: "orders.circl_status.job_failed",
      }
    } else if (metadata.fulfillment.status == "job.completed") {
      return {
        color: "green",
        label: "orders.circl_status.job_completed",
      }
    }
    return {
      color: "green",
      label: "orders.circl_status.unknown",
    }
  } else {
    return {
      color: "orange",
      label: "orders.circl_status.unknown",
    }
  }
  //   return { color: "orange", label: order.fulfillment_status }
}

export const OrderStatus = ({ order }: OrderStatusProps) => {
  const { color, label } = parseOrderStatus(order)
  const { t } = useTranslation()
  return <StatusCell color={color}>{t(label as any)}</StatusCell>
}
export const OrderStatusBadge = ({ order }: OrderStatusProps) => {
  const { color, label } = parseOrderStatus(order)
  const { t } = useTranslation()
  return (
    <StatusBadge color={color} className="text-nowrap">
      {t(label as any)}
    </StatusBadge>
  )
}

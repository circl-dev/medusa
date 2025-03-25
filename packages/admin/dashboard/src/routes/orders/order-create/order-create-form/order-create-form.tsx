import { Button, toast } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { RouteFocusModal, useRouteModal } from "../../../../components/modals"
import { KeyboundForm } from "../../../../components/utilities/keybound-form"
import { OrderCreateSchema } from "../constants"
import { OrderCreateDetailsForm } from "../order-create-details-form"
import { useMutation } from "@tanstack/react-query"
import { sdk } from "../../../../lib/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as zod from "zod"
import {
  AdminProduct,
  AdminCustomer,
  AdminRegion,
  AdminFulfillmentProvider,
} from "@medusajs/types"
import { ordersQueryKeys } from "../../../../hooks/api"
import { queryClient } from "../../../../lib/query-client"

type OrderCreateFormProps = {
  products: AdminProduct[]
  customers: AdminCustomer[]
  regions: AdminRegion[]
  fulfillmentProviders: AdminFulfillmentProvider[]
}

export const OrderCreateForm = ({
  products,
  customers,
  regions,
  fulfillmentProviders,
}: OrderCreateFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<zod.infer<typeof OrderCreateSchema>>({
    defaultValues: {
      shipping_address: {
        address_1: "",
        city: "",
        country_code: "",
        postal_code: "",
        phone: "",
      },
    },
    resolver: zodResolver(OrderCreateSchema),
    mode: "onTouched",
  })

  type CreateAdminOrderInput = {
    is_visit?: boolean /* If true, this order is a request for visit from the customer */
    products: {
      variant_id: string
      quantity: number
    }[]
    shipping_address: {
      address_1: string
      address_2?: string
      city: string
      country_code: string
      postal_code: string
      phone?: string
    }
    fulfillment_provider_id?: string
    billing_address?: string
    customer_id: string
    currency_code?: string
    sales_channel_id?: string
    region_id: string
    email?: string
  }

  const { mutate } = useMutation<any, Error, CreateAdminOrderInput>({
    mutationFn: (body: CreateAdminOrderInput) =>
      sdk.client.fetch(`/admin/order`, {
        method: "POST",
        body,
      }),
    onSuccess: async (data) => {
      toast.success(t("orders.create.successToast"))
      /* Wait for the order to be created before redirecting, since fulfillment is created asynchronously */
      await new Promise((resolve) => setTimeout(resolve, 2000))
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.lists(),
      })
      handleSuccess(`../${data.id}`)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const handleSubmit = form.handleSubmit(async (values, e) => {
    // TODO understand why ts complains about the values type
    // @ts-ignore
    const filteredArray = values.isVisit
      ? []
      : Object.entries(values.variants)
          // @ts-ignore
          .filter(([_, value]) => value.quantity !== undefined)
          .map(([key, value]) => ({
            variant_id: key,
            // @ts-ignore
            quantity: value.quantity || 0,
          }))
    mutate({
      is_visit: values.isVisit,
      products: filteredArray,
      shipping_address: values.shipping_address,
      customer_id: values.customer_id,
      region_id: values.region_id,
    })
  })

  return (
    <RouteFocusModal.Form form={form}>
      <KeyboundForm
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault()
            handleSubmit()
          }
        }}
        onSubmit={handleSubmit}
        className="flex h-full flex-col"
      >
        <RouteFocusModal.Header />
        <RouteFocusModal.Body className="size-full overflow-y-auto">
          <OrderCreateDetailsForm
            form={form}
            products={products}
            customers={customers}
            regions={regions}
            fulfillmentProviders={fulfillmentProviders}
          />
        </RouteFocusModal.Body>
        <RouteFocusModal.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button variant="secondary" size="small">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <PrimaryButton />
          </div>
        </RouteFocusModal.Footer>
      </KeyboundForm>
    </RouteFocusModal.Form>
  )
}

const PrimaryButton = () => {
  const { t } = useTranslation()
  return (
    <Button
      data-name="publish-button"
      key="submit-button"
      type="submit"
      variant="primary"
      size="small"
    >
      {t("actions.save")}
    </Button>
  )
}

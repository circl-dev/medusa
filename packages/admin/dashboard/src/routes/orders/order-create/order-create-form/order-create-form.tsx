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
import { AdminProduct, AdminCustomer, AdminRegion } from "@medusajs/types"

type OrderCreateFormProps = {
  products: AdminProduct[]
  customers: AdminCustomer[]
  regions: AdminRegion[]
}

export const OrderCreateForm = ({
  products,
  customers,
  regions,
}: OrderCreateFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<zod.infer<typeof OrderCreateSchema>>({
    // TODO?
    defaultValues: {},
    resolver: zodResolver(OrderCreateSchema),
  })

  console.log(products)

  type CreateAdminOrderInput = {
    is_visit?: boolean /* If true, this order is a request for visit from the customer */
    products: {
      variant_id: string
      quantity: number
    }[]
    shipping_address?: string
    billing_address?: string
    customer_id: string
    currency_code?: string
    sales_channel_id: string
    region_id: string
    email?: string
  }

  const { mutate } = useMutation<any, Error, CreateAdminOrderInput>({
    mutationFn: (body: CreateAdminOrderInput) =>
      sdk.client.fetch(`/admin/order`, {
        method: "POST",
        body,
      }),
    onSuccess: (data) => {
      toast.success(t("orders.create.successToast"))

      handleSuccess(`../${data.id}`)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const handleSubmit = form.handleSubmit(async (values, e) => {
    console.log(values)
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
    console.log("request:", {
      is_visit: values.isVisit,
      products: filteredArray,
      shipping_address: values.shipping_address,
      customer_id: values.customer_id,
      region_id: values.region_id,
      sales_channel_id: "sc_01JKX2B418X0C1XPRHF7MV177T",
    })
    mutate({
      is_visit: values.isVisit,
      products: filteredArray,
      shipping_address: values.shipping_address,
      customer_id: values.customer_id,
      region_id: values.region_id,
      sales_channel_id: "sc_01JKX2B418X0C1XPRHF7MV177T",
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

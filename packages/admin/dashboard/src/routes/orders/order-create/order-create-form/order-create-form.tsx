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
import { AdminProduct } from "@medusajs/types"

type OrderCreateFormProps = { products: AdminProduct[] }

export const OrderCreateForm = ({ products }: OrderCreateFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<zod.infer<typeof OrderCreateSchema>>({
    // TODO?
    defaultValues: {},
    resolver: zodResolver(OrderCreateSchema),
  })

  type CreateDraftOrderInput = {
    is_visit?: boolean /* If true, this order is a request for visit from the customer */
    products: {
      variant_id: string
      quantity: number
    }[]
    shipping_address: string
    currency_code?: string
  }

  const { mutate } = useMutation<any, Error, CreateDraftOrderInput>({
    mutationFn: (body: CreateDraftOrderInput) =>
      sdk.client.fetch(`/admin/order`, {
        method: "POST",
        body,
      }),
    onSuccess: (data) => {
      toast.success(t("orders.create.successToast"))

      handleSuccess(`../${data.draftOrder.id}`)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const handleSubmit = form.handleSubmit(async (values, e) => {
    console.log("values", values)
    mutate({
      is_visit: values.isVisit,
      products: [],
      shipping_address: values.shipping_address,
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
          <OrderCreateDetailsForm form={form} products={products} />
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

type PrimaryButtonProps = {}

const PrimaryButton = ({}: PrimaryButtonProps) => {
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

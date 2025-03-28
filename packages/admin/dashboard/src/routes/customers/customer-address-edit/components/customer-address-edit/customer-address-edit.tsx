import { zodResolver } from "@hookform/resolvers/zod"
import { HttpTypes } from "@medusajs/types"
import { Button, toast } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import * as zod from "zod"

import { RouteDrawer, useRouteModal } from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import {
  useCreateCustomerAddress,
  useUpdateCustomerAddress,
} from "../../../../../hooks/api/customers"
import {
  CustomerAddressForm,
  CustomerAddressFormSchema,
} from "../../../../../components/forms/customer-address-form/customer-address-form"

type CustomerAddressEditFormProps = {
  customerId: string
  address?: HttpTypes.AdminCustomerAddress
}
export const CustomerAddressEditForm = ({
  customerId,
  address,
}: CustomerAddressEditFormProps) => {
  const { handleSuccess } = useRouteModal()

  const form = useForm<zod.infer<typeof CustomerAddressFormSchema>>({
    defaultValues: {
      address_1: address?.address_1 || "",
      address_2: address?.address_2 || "",
      city: address?.city || "",
      country_code: address?.country_code || "",
      postal_code: address?.postal_code || "",
      is_default_shipping: address?.is_default_shipping || false,
      is_default_billing: address?.is_default_billing || false,
    },
    resolver: zodResolver(CustomerAddressFormSchema),
  })

  const { mutateAsync: updateAddress, isPending: isUpdating } =
    useUpdateCustomerAddress(customerId, address?.id || "")

  const { mutateAsync: createAddress, isPending: isCreating } =
    useCreateCustomerAddress(customerId)

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      console.log("Submtiing", address)
      if (address) {
        console.log("Updating", data)
        await updateAddress(data)
        toast.success("Address updated successfully")
      } else {
        await createAddress(data)
        toast.success("Address created successfully")
      }
      handleSuccess()
    } catch (error) {
      toast.error(
        address ? "Failed to update address" : "Failed to create address"
      )
    }
  })

  return (
    <RouteDrawer.Form form={form}>
      <KeyboundForm onSubmit={handleSubmit} className="flex flex-1 flex-col">
        <RouteDrawer.Body>
          <CustomerAddressForm form={form} />
        </RouteDrawer.Body>
        <RouteDrawer.Footer>
          <Button
            type="submit"
            variant="primary"
            isLoading={isUpdating || isCreating}
          >
            Save
          </Button>
        </RouteDrawer.Footer>
      </KeyboundForm>
    </RouteDrawer.Form>
  )
}

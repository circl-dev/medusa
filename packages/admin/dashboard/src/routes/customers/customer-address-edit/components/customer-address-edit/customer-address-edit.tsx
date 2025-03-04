import { zodResolver } from "@hookform/resolvers/zod"
import { HttpTypes } from "@medusajs/types"
import { Button, Input, toast } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { Form } from "../../../../../components/common/form"
import { CountrySelect } from "../../../../../components/inputs/country-select"
import { RouteDrawer, useRouteModal } from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import {
  useCreateCustomerAddress,
  useUpdateCustomerAddress,
} from "../../../../../hooks/api/customers"

type CustomerAddressEditFormProps = {
  customerId: string
  address?: HttpTypes.AdminCustomerAddress
}

const AddressFormSchema = zod.object({
  address_1: zod.string().min(1, "Address Line 1 is required"),
  address_2: zod.string().optional(),
  city: zod.string().min(1, "City is required"),
  country_code: zod.string().min(1, "Country is required"),
  postal_code: zod.string().min(1, "Postal Code is required"),
})

export const CustomerAddressEditForm = ({
  customerId,
  address,
}: CustomerAddressEditFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<zod.infer<typeof AddressFormSchema>>({
    defaultValues: {
      address_1: address?.address_1 || "",
      address_2: address?.address_2 || "",
      city: address?.city || "",
      country_code: address?.country_code || "",
      postal_code: address?.postal_code || "",
    },
    resolver: zodResolver(AddressFormSchema),
  })

  const { mutateAsync: updateAddress, isPending: isUpdating } =
    useUpdateCustomerAddress(customerId, address?.id || "")

  const { mutateAsync: createAddress, isPending: isCreating } =
    useCreateCustomerAddress(customerId)

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      if (address) {
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
          <div className="flex flex-col gap-y-4">
            <Form.Field
              control={form.control}
              name="address_1"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Address Line 1</Form.Label>
                  <Form.Control>
                    <Input {...field} />
                  </Form.Control>
                  <Form.ErrorMessage />
                </Form.Item>
              )}
            />
            <Form.Field
              control={form.control}
              name="address_2"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Address Line 2</Form.Label>
                  <Form.Control>
                    <Input {...field} />
                  </Form.Control>
                  <Form.ErrorMessage />
                </Form.Item>
              )}
            />
            <Form.Field
              control={form.control}
              name="city"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>City</Form.Label>
                  <Form.Control>
                    <Input {...field} />
                  </Form.Control>
                  <Form.ErrorMessage />
                </Form.Item>
              )}
            />
            <Form.Field
              control={form.control}
              name="country_code"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Country</Form.Label>
                  <Form.Control>
                    <CountrySelect {...field} />
                  </Form.Control>
                  <Form.ErrorMessage />
                </Form.Item>
              )}
            />
            <Form.Field
              control={form.control}
              name="postal_code"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Postal Code</Form.Label>
                  <Form.Control>
                    <Input {...field} />
                  </Form.Control>
                  <Form.ErrorMessage />
                </Form.Item>
              )}
            />
          </div>
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

import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Checkbox, Heading, Input, Text, toast } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { Form } from "../../../../../components/common/form"
import { CountrySelect } from "../../../../../components/inputs/country-select"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import { useCreateCustomerAddress } from "../../../../../hooks/api/customers"

const AddressFormSchema = zod.object({
  address_1: zod.string().min(1, "Address Line 1 is required"),
  address_2: zod.string().optional(),
  city: zod.string().min(1, "City is required"),
  country_code: zod.string().min(1, "Country is required"),
  postal_code: zod.string().min(1, "Postal Code is required"),
  is_default_shipping: zod.boolean().optional(),
  is_default_billing: zod.boolean().optional(),
})

type CreateCustomerAddressFormProps = {
  customerId: string
}

export const CreateCustomerAddressForm = ({
  customerId,
}: CreateCustomerAddressFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<zod.infer<typeof AddressFormSchema>>({
    defaultValues: {
      address_1: "",
      address_2: "",
      city: "",
      country_code: "",
      postal_code: "",
      is_default_shipping: false,
    },
    resolver: zodResolver(AddressFormSchema),
  })

  const { mutateAsync: createAddress, isPending } =
    useCreateCustomerAddress(customerId)

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await createAddress(data)
      toast.success("Address created successfully")
      handleSuccess(`/customers/${customerId}`)
    } catch (error) {
      toast.error("Failed to create address")
    }
  })

  return (
    <RouteFocusModal.Form form={form}>
      <KeyboundForm
        onSubmit={handleSubmit}
        className="flex flex-1 flex-col overflow-hidden"
      >
        <RouteFocusModal.Body className="flex flex-1 flex-col items-center overflow-y-auto py-16">
          <div className="flex w-full max-w-[720px] flex-col gap-y-8">
            <div>
              <Heading>{t("customers.edit.editShippingAddress")}</Heading>
              <Text size="small" className="text-ui-fg-subtle">
                {t("customers.create.hint")}
              </Text>
            </div>
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
              <Form.Field
                control={form.control}
                name="is_default_shipping"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Default Shipping Address</Form.Label>
                    <Form.Control>
                      <Checkbox
                        {...field}
                        value={field.value ? "true" : "false"}
                      />
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )}
              />
              <Form.Field
                control={form.control}
                name="is_default_billing"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Default Billing Address</Form.Label>
                    <Form.Control>
                      <Checkbox
                        {...field}
                        value={field.value ? "true" : "false"}
                      />
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )}
              />
            </div>
          </div>
        </RouteFocusModal.Body>
        <RouteFocusModal.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button
              size="small"
              variant="primary"
              type="submit"
              isLoading={isPending}
            >
              {t("actions.create")}
            </Button>
          </div>
        </RouteFocusModal.Footer>
      </KeyboundForm>
    </RouteFocusModal.Form>
  )
} 
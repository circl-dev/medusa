import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form } from "../../common/form"
import { Checkbox, Input } from "@medusajs/ui"
import { CountrySelect } from "../../inputs/country-select"

export const CustomerAddressFormSchema = z.object({
  address_1: z.string().min(1, "Address Line 1 is required"),
  address_2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  country_code: z.string().min(1, "Country is required"),
  postal_code: z.string().min(1, "Postal Code is required"),
  is_default_shipping: z.boolean().optional(),
  is_default_billing: z.boolean().optional(),
})

interface CustomerAddressFormProps {
  form: ReturnType<typeof useForm<z.infer<typeof CustomerAddressFormSchema>>>
}

export const CustomerAddressForm = ({ form }: CustomerAddressFormProps) => {
  return (
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
              <Checkbox {...field} value={field.value ? "true" : "false"} />
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
                checked={field.value}
                onCheckedChange={(value) => field.onChange(value)}
              />
            </Form.Control>
            <Form.ErrorMessage />
          </Form.Item>
        )}
      />
    </div>
  )
}

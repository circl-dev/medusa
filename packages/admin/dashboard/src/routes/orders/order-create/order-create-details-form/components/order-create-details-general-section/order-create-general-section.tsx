import { Input, Select } from "@medusajs/ui"
import { UseFormReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { OrderCreateSchemaType } from "../../../types"
import { Form } from "../../../../../../components/common/form"
import {
  AdminCustomer,
  AdminFulfillmentProvider,
  AdminRegion,
} from "@medusajs/types"
import { useRetrieveCustomerAddresses } from "../../../../../../hooks/api/customers"
import { useMemo } from "react"
import { CountrySelect } from "../../../../../../components/inputs/country-select/country-select"

type OrderCreateGeneralSectionProps = {
  form: UseFormReturn<OrderCreateSchemaType>
  customers: AdminCustomer[]
  regions: AdminRegion[]
  fulfillmentProviders: AdminFulfillmentProvider[]
}

export const OrderCreateGeneralSection = ({
  form,
  customers,
  regions,
  fulfillmentProviders,
}: OrderCreateGeneralSectionProps) => {
  const { t } = useTranslation()

  const { data: addresses } = useRetrieveCustomerAddresses(
    form.watch("customer_id")
  )

  useMemo(() => {
    if (addresses?.length && regions?.length && form) {
      if (addresses[0].address_1) {
        form.setValue("shipping_address.address_1", addresses[0].address_1)
      }
      if (addresses[0].city) {
        form.setValue("shipping_address.city", addresses[0].city)
      }
      if (addresses[0].country_code) {
        form.setValue(
          "shipping_address.country_code",
          addresses[0].country_code
        )
      }
      if (addresses[0].postal_code) {
        form.setValue("shipping_address.postal_code", addresses[0].postal_code)
      }
      if (addresses[0].phone) {
        form.setValue("shipping_address.phone", addresses[0].phone)
      }

      if (addresses[0].country_code) {
        const region = regions.find(
          (r) =>
            r.countries &&
            r.countries.some((c) => c.iso_2 === addresses[0].country_code)
        )
        if (region) {
          form.setValue("region_id", region.id)
        }
      }
    } else {
      form.setValue("shipping_address", {
        address_1: "",
        city: "",
        country_code: "",
        postal_code: "",
        phone: "",
      })
    }
  }, [form, regions, addresses])
  console.log(fulfillmentProviders)
  return (
    <div id="general" className="flex flex-col gap-y-6">
      <Form.Field
        control={form.control}
        name="customer_id"
        render={({ field: { onChange, ref, ...field } }) => {
          return (
            <Form.Item>
              <div className="flex flex-col items-center gap-3 xl:flex-row">
                <div className="flex-1">
                  <Form.Label>
                    {t("orders.create.fields.customer.label")}
                  </Form.Label>
                  <Form.Hint>
                    {t("orders.create.fields.customer.hint")}
                  </Form.Hint>
                </div>
                <div className="w-full flex-1">
                  <Form.Control>
                    <Select onValueChange={onChange} {...field}>
                      <Select.Trigger className="bg-ui-bg-base" ref={ref}>
                        <Select.Value />
                      </Select.Trigger>
                      <Select.Content>
                        {customers.map((c) => (
                          <Select.Item key={c.id} value={c.id}>
                            {c.first_name && c.last_name
                              ? `${c.first_name} ${c.last_name} - ${c.email}`
                              : c.email}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select>
                  </Form.Control>
                </div>
              </div>
              <Form.ErrorMessage />
            </Form.Item>
          )
        }}
      />
      {form.watch("customer_id") && (
        <>
          <Form.Field
            control={form.control}
            name="region_id"
            render={({ field: { onChange, ref, ...field } }) => {
              return (
                <Form.Item>
                  <div className="flex flex-col items-center gap-3 xl:flex-row">
                    <div className="flex-1">
                      <Form.Label>
                        {t("orders.create.fields.region.label")}
                      </Form.Label>
                      <Form.Hint>
                        {t("orders.create.fields.region.hint")}
                      </Form.Hint>
                    </div>
                    <div className="w-full flex-1">
                      <Form.Control>
                        <Select onValueChange={onChange} {...field}>
                          <Select.Trigger className="bg-ui-bg-base" ref={ref}>
                            <Select.Value />
                          </Select.Trigger>
                          <Select.Content>
                            {regions.map((r) => (
                              <Select.Item key={r.id} value={r.id}>
                                {r.name}
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select>
                      </Form.Control>
                    </div>
                  </div>
                  <Form.ErrorMessage />
                </Form.Item>
              )
            }}
          />
          <Form.Field
            control={form.control}
            name="shipping_address.address_1"
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
            name="shipping_address.address_2"
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
            name="shipping_address.city"
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
            name="shipping_address.country_code"
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
            name="shipping_address.postal_code"
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
            name="fulfillment_provider_id"
            render={({ field: { onChange, ref, ...field } }) => {
              return (
                <Form.Item>
                  <div className="flex flex-col items-center gap-3 xl:flex-row">
                    <div className="flex-1">
                      <Form.Label>
                        {t("orders.create.fields.fulfillmentProvider.label")}
                      </Form.Label>
                      <Form.Hint>
                        {t("orders.create.fields.fulfillmentProvider.hint")}
                      </Form.Hint>
                    </div>
                    <div className="w-full flex-1">
                      <Form.Control>
                        <Select onValueChange={onChange} {...field}>
                          <Select.Trigger className="bg-ui-bg-base" ref={ref}>
                            <Select.Value />
                          </Select.Trigger>
                          <Select.Content>
                            {fulfillmentProviders.map((r) => (
                              <Select.Item key={r.id} value={r.id}>
                                {r.id}
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select>
                      </Form.Control>
                    </div>
                  </div>
                  <Form.ErrorMessage />
                </Form.Item>
              )
            }}
          />
        </>
      )}
    </div>
  )
}

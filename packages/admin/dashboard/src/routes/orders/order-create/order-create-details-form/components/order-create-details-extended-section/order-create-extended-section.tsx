import { Input } from "@medusajs/ui"
import { UseFormReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { OrderCreateSchemaType } from "../../../types"
import { Form } from "../../../../../../components/common/form"
import { Combobox } from "../../../../../../components/inputs/combobox"
import { AdminProduct } from "@medusajs/types"
import { sdk } from "../../../../../../lib/client"
import { useComboboxData } from "../../../../../../hooks/use-combobox-data"

type OrderCreateExtendedSectionProps = {
  form: UseFormReturn<OrderCreateSchemaType>
  products: AdminProduct[]
}

export const OrderCreateExtendedSection = ({
  form,
}: OrderCreateExtendedSectionProps) => {
  const { t } = useTranslation()

  const products = useComboboxData({
    queryKey: ["products"],
    queryFn: (params) => sdk.admin.product.list(params),
    getOptions: (data) =>
      data.products.map((p) => ({
        label: p.title,
        value: p.variants ? p.variants[0].id : "",
      })),
  })

  return (
    <div id="general" className="flex flex-col gap-y-6">
      <Form.Field
        control={form.control}
        name="variant_id"
        render={({ field }) => {
          return (
            <Form.Item>
              <Form.Label>
                {t("products.fields.shipping_profile.label")}
              </Form.Label>
              <Form.Control>
                <Combobox
                  {...field}
                  options={products.options}
                  searchValue={products.searchValue}
                  onSearchValueChange={products.onSearchValueChange}
                  fetchNextPage={products.fetchNextPage}
                />
              </Form.Control>
              <Form.ErrorMessage />
            </Form.Item>
          )
        }}
      />
      <Form.Field
        control={form.control}
        name="name"
        render={({ field }) => {
          return (
            <Form.Item>
              <Form.Label>{t("orders.create.fields.name.label")}</Form.Label>
              <Form.Control>
                <Input
                  {...field}
                  placeholder={t("orders.create.fields.name.placeholder")}
                />
              </Form.Control>
            </Form.Item>
          )
        }}
      />
      <Form.Field
        control={form.control}
        name="product_id"
        render={({ field }) => {
          return (
            <Form.Item>
              <Form.Label>
                {t("orders.create.fields.product_id.label")}
              </Form.Label>
              <Form.Control>
                <Input
                  {...field}
                  placeholder={t("orders.create.fields.product_id.placeholder")}
                />
              </Form.Control>
            </Form.Item>
          )
        }}
      />
      <Form.Field
        control={form.control}
        name="quantity"
        render={({ field }) => {
          return (
            <Form.Item>
              <Form.Label>
                {t("orders.create.fields.quantity.label")}
              </Form.Label>
              <Form.Control>
                <Input
                  {...field}
                  type="number"
                  min={1}
                  placeholder={t("orders.create.fields.quantity.placeholder")}
                />
              </Form.Control>
            </Form.Item>
          )
        }}
      />
      <Form.Field
        control={form.control}
        name="title"
        render={({ field }) => {
          return (
            <Form.Item>
              <Form.Label optional>
                {t("orders.create.fields.title.label")}
              </Form.Label>
              <Form.Control>
                <Input
                  {...field}
                  placeholder={t("orders.create.fields.title.placeholder")}
                />
              </Form.Control>
            </Form.Item>
          )
        }}
      />
      <Form.Field
        control={form.control}
        name="unit_price"
        render={({ field }) => {
          return (
            <Form.Item>
              <Form.Label>
                {t("orders.create.fields.unit_price.label")}
              </Form.Label>
              <Form.Control>
                <Input
                  {...field}
                  type="number"
                  min={0}
                  placeholder={t("orders.create.fields.unit_price.placeholder")}
                />
              </Form.Control>
            </Form.Item>
          )
        }}
      />
    </div>
  )
}

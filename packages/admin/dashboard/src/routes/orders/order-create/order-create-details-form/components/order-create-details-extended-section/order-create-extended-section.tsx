import { Alert, Input } from "@medusajs/ui"
import { UseFormReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { OrderCreateSchemaType } from "../../../types"
import { Form } from "../../../../../../components/common/form"
import { AdminProduct } from "@medusajs/types"
import { useMemo, useState } from "react"
import { OrderCreateProductItem } from "./order-create-product-item"

type OrderCreateExtendedSectionProps = {
  form: UseFormReturn<OrderCreateSchemaType>
  products: AdminProduct[]
}

export const OrderCreateExtendedSection = ({
  form,
  products,
}: OrderCreateExtendedSectionProps) => {
  const { t } = useTranslation()
  const [filterTerm, setFilterTerm] = useState("")

  const filteredProducts = useMemo(() => {
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(filterTerm) ||
        p.variants?.some((v) => v.title?.toLowerCase().includes(filterTerm))
    )
  }, [products, filterTerm])

  const onQuantityChange = (value: number | null, variantId: string) => {
    form.setValue(`variants.${variantId}.quantity`, value || undefined)
  }

  // @ts-ignore todo fix this later
  const orderError = form.formState?.errors?.variants?.root?.message

  return (
    <div id="general" className="flex flex-col gap-y-6">
      <Form.Item className="mt-8">
        <div className="flex flex-row items-center">
          <div className="flex-1">
            <Form.Label>{t("orders.create.fields.products.label")}</Form.Label>
            <Form.Hint>{t("orders.create.fields.products.hint")}</Form.Hint>
          </div>
          <div className="flex-1">
            <Input
              value={filterTerm}
              onChange={(e) => setFilterTerm(e.target.value)}
              placeholder={t("orders.create.fields.products.search")}
              autoComplete="off"
              type="search"
            />
          </div>
        </div>
        {orderError && (
          <Alert className="mb-4" dismissible variant="error">
            {orderError}
          </Alert>
        )}

        <div className="flex flex-col gap-y-1">
          {filteredProducts.map((p) => (
            <OrderCreateProductItem
              key={p.id}
              product={p}
              form={form}
              onQuantityChange={onQuantityChange}
            />
          ))}
        </div>
      </Form.Item>
    </div>
  )
}

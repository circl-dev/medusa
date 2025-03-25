import { Thumbnail } from "../../../../../../components/common/thumbnail"
import { Input, Text } from "@medusajs/ui"
import { AdminProduct } from "@medusajs/types"
import { Form } from "../../../../../../components/common/form"
import { UseFormReturn, useWatch } from "react-hook-form"
import { OrderCreateSchemaType } from "../../../types"
import { getStylizedAmount } from "../../../../../../lib/money-amount-helpers"

type OrderCreateProductItemProps = {
  form: UseFormReturn<OrderCreateSchemaType>
  product: AdminProduct
  onQuantityChange: (value: number | null, variantId: string) => void
}
export function OrderCreateProductItem({
  form,
  product,
  onQuantityChange,
}: OrderCreateProductItemProps) {
  const regionId = useWatch({
    control: form.control,
    name: "region_id",
  })

  return (
    <div className="bg-ui-bg-subtle shadow-elevation-card-rest my-2 divide-y divide-dashed rounded-xl lg:min-w-[720px]">
      <div className="flex flex-col gap-4 p-3 text-sm">
        <div className="flex items-center gap-x-3">
          <Thumbnail src={product.thumbnail} />
          <div className="flex flex-col">
            <div className="flex flex-row">
              <Text className="txt-small flex" as="span" weight="plus">
                {product.title}
              </Text>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {product.variants?.map((variant) => {
            const price = variant.prices?.find(
              (p) =>
                // @ts-ignore broken medusa type
                p?.rules?.region_id &&
                // @ts-ignore broken medusa type
                p?.rules?.region_id === regionId
            )
            return (
              <div
                className="bg-ui-bg-base border-ui-border-base flex items-center justify-between rounded-md border p-2"
                key={variant.id}
              >
                <div className="flex items-end gap-2">
                  <Text>{variant.title}</Text>
                  <Text className="txt-xsmall text-ui-fg-muted">
                    {variant.sku}
                  </Text>
                </div>
                <div className="flex items-center gap-2">
                  {price?.amount && price?.currency_code && (
                    <Text className="txt-xsmall text-ui-fg-muted">
                      {getStylizedAmount(
                        price?.amount || 0,
                        price?.currency_code || "eur"
                      )}
                    </Text>
                  )}
                  <Form.Field
                    control={form.control}
                    name={`variants.${variant.id}.quantity`}
                    render={({ field }) => {
                      return (
                        <Form.Item>
                          <Form.Control>
                            <Input
                              className="bg-ui-bg-base txt-small w-[46px] rounded-lg [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                              type="number"
                              {...field}
                              onChange={(v) => {
                                const val =
                                  v.target.value === ""
                                    ? null
                                    : Number(v.target.value)

                                onQuantityChange(val, variant.id)
                              }}
                            />
                          </Form.Control>
                        </Form.Item>
                      )
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

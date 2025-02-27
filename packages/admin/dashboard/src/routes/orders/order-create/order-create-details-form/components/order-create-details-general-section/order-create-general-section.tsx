import { Input } from "@medusajs/ui"
import { UseFormReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { OrderCreateSchemaType } from "../../../types"
import { Form } from "../../../../../../components/common/form"

type OrderCreateGeneralSectionProps = {
  form: UseFormReturn<OrderCreateSchemaType>
}

export const OrderCreateGeneralSection = ({
  form,
}: OrderCreateGeneralSectionProps) => {
  const { t } = useTranslation()

  return (
    <div id="general" className="flex flex-col gap-y-6">
      <Form.Field
        control={form.control}
        name="shipping_address"
        render={({ field }) => {
          return (
            <Form.Item>
              <Form.Label>{t("orders.create.fields.address.label")}</Form.Label>
              <Form.Control>
                <Input
                  {...field}
                  placeholder={t("orders.create.fields.address.placeholder")}
                />
              </Form.Control>
            </Form.Item>
          )
        }}
      />
    </div>
  )
}

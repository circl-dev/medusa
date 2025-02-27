import { Heading } from "@medusajs/ui"
import { UseFormReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { OrderCreateGeneralSection } from "./components/order-create-details-general-section"
import { OrderCreateSchemaType } from "../types"
import { SwitchBox } from "../../../../components/common/switch-box"
import { OrderCreateExtendedSection } from "./components/order-create-details-extended-section"
import { AdminCustomer, AdminProduct, AdminRegion } from "@medusajs/types"

type OrderAttributesProps = {
  form: UseFormReturn<OrderCreateSchemaType>
  products: AdminProduct[]
  customers: AdminCustomer[]
  regions: AdminRegion[]
}

export const OrderCreateDetailsForm = ({
  form,
  products,
  customers,
  regions,
}: OrderAttributesProps) => {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col items-center p-16">
      <div className="flex w-full max-w-[720px] flex-col gap-y-8">
        <Header />
        <div className="flex flex-col gap-y-6">
          <SwitchBox
            control={form.control}
            defaultValue={false}
            name="isVisit"
            label={t("orders.create.fields.enableVisit.label")}
            description={t("orders.create.fields.enableVisit.hint")}
          />
          <OrderCreateGeneralSection
            form={form}
            customers={customers}
            regions={regions}
          />
          {!form.watch("isVisit") && (
            <OrderCreateExtendedSection form={form} products={products} />
          )}
        </div>
      </div>
    </div>
  )
}

const Header = () => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col">
      <Heading>{t("orders.create.header")}</Heading>
    </div>
  )
}

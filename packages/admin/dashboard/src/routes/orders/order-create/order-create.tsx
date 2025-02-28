import { useTranslation } from "react-i18next"
import { RouteFocusModal } from "../../../components/modals"
import { OrderCreateForm } from "./order-create-form"
import { useCustomers, useProducts, useRegions } from "../../../hooks/api"

export const OrderCreate = () => {
  const { t } = useTranslation()
  const { products, isLoading: loadingProducts } = useProducts({
    fields: "*variants",
  })

  const { customers, isLoading: loadingCustomers } = useCustomers()

  const { regions, isLoading: loadingRegions } = useRegions()

  const ready =
    !!products &&
    !loadingProducts &&
    !!customers &&
    !loadingCustomers &&
    !!regions &&
    !loadingRegions

  return (
    <RouteFocusModal>
      <RouteFocusModal.Title asChild>
        <span className="sr-only">{t("orders.create.title")}</span>
      </RouteFocusModal.Title>
      <RouteFocusModal.Description asChild>
        <span className="sr-only">{t("orders.create.description")}</span>
      </RouteFocusModal.Description>
      {ready && (
        <OrderCreateForm
          products={products}
          customers={customers}
          regions={regions}
        />
      )}
    </RouteFocusModal>
  )
}

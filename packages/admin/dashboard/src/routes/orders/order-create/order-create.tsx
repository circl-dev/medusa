import { useTranslation } from "react-i18next"
import { RouteFocusModal } from "../../../components/modals"
import { OrderCreateForm } from "./order-create-form"
import { useProducts } from "../../../hooks/api"

export const OrderCreate = () => {
  const { t } = useTranslation()
  const { products, isLoading: loadingProducts } = useProducts({
    fields: "*variants",
  })
  console.log(products)

  const ready = !!products && !loadingProducts
  return (
    <RouteFocusModal>
      <RouteFocusModal.Title asChild>
        <span className="sr-only">{t("orders.create.title")}</span>
      </RouteFocusModal.Title>
      <RouteFocusModal.Description asChild>
        <span className="sr-only">{t("orders.create.description")}</span>
      </RouteFocusModal.Description>
      {ready && <OrderCreateForm products={products} />}
    </RouteFocusModal>
  )
}

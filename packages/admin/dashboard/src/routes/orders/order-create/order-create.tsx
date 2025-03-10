import { useTranslation } from "react-i18next"
import { RouteFocusModal } from "../../../components/modals"
import { OrderCreateForm } from "./order-create-form"
import {
  useCustomers,
  useFulfillmentProviders,
  useProducts,
  useRegions,
  useShippingOptions,
} from "../../../hooks/api"

export const OrderCreate = () => {
  const { t } = useTranslation()
  const { products, isLoading: loadingProducts } = useProducts({
    fields: "*variants",
  })

  const { customers, isLoading: loadingCustomers } = useCustomers()

  const { regions, isLoading: loadingRegions } = useRegions()

  const { fulfillment_providers, isLoading: loadingFulfillmentProviders } =
    useFulfillmentProviders()

  const { shipping_options } = useShippingOptions()
  console.log(shipping_options)

  const ready =
    !!products &&
    !loadingProducts &&
    !!customers &&
    !loadingCustomers &&
    !!regions &&
    !loadingRegions &&
    !!fulfillment_providers &&
    !loadingFulfillmentProviders

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
          fulfillmentProviders={fulfillment_providers}
        />
      )}
    </RouteFocusModal>
  )
}

import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { RouteDrawer } from "../../../components/modals"
import { useCustomer } from "../../../hooks/api/customers"
import { CustomerAddressEditForm } from "./components/customer-address-edit"

export const CustomerAddressEdit = () => {
  const { t } = useTranslation()

  const { id } = useParams()
  const { customer, isLoading, isError, error } = useCustomer(id!)

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("customers.edit.header")}</Heading>
      </RouteDrawer.Header>
      {!isLoading && customer && <CustomerAddressEditForm customerId={id!} />}
    </RouteDrawer>
  )
}

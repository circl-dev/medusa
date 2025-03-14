import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { RouteDrawer } from "../../../components/modals"
import {
  useCustomer,
  useRetrieveCustomerAddresses,
} from "../../../hooks/api/customers"
import { CustomerAddressEditForm } from "./components/customer-address-edit"

export const CustomerAddressEdit = () => {
  const { t } = useTranslation()

  const { id, address_id } = useParams()
  const { customer, isLoading, isError, error } = useCustomer(id!)
  const { data: address } = useRetrieveCustomerAddresses(id!)

  const target_address = address?.find((a) => a.id === address_id)

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("customers.edit.editShippingAddress")}</Heading>
      </RouteDrawer.Header>
      {!isLoading && customer && target_address && (
        <CustomerAddressEditForm customerId={id!} address={target_address} />
      )}
    </RouteDrawer>
  )
}

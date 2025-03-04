import { PencilSquare, Plus, Trash } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import {
  Container,
  Heading,
  IconButton,
  Table,
  Text,
  toast,
  usePrompt,
} from "@medusajs/ui"
import { useNavigate } from "react-router-dom"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { useDeleteCustomerAddress } from "../../../../../hooks/api/customers"

type CustomerAddressSectionProps = {
  customerId: string
  addresses: HttpTypes.AdminCustomerAddress[]
}

export const CustomerAddressSection = ({
  customerId,
  addresses,
}: CustomerAddressSectionProps) => {
  const prompt = usePrompt()
  const navigate = useNavigate()

  const { mutateAsync: deleteAddress } = useDeleteCustomerAddress(
    customerId,
    "" // This will be set when deleting
  )

  const handleDelete = async (addressId: string) => {
    const res = await prompt({
      title: "Delete Address",
      description: "Are you sure you want to delete this address?",
      verificationInstruction: "Type to confirm",
      verificationText: addressId,
      confirmText: "Delete",
      cancelText: "Cancel",
    })

    if (!res) {
      return
    }

    try {
      await deleteAddress()
      toast.success("Address deleted successfully")
    } catch (error) {
      toast.error("Failed to delete address")
    }
  }

  const handleAdd = () => {
    navigate("edit-address")
  }

  return (
    <Container className="p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>Addresses</Heading>
        <IconButton variant="transparent" onClick={handleAdd}>
          <Plus className="text-ui-fg-base" />
        </IconButton>
      </div>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Address Line 1</Table.HeaderCell>
            <Table.HeaderCell>Address Line 2</Table.HeaderCell>
            <Table.HeaderCell>City</Table.HeaderCell>
            <Table.HeaderCell>Country</Table.HeaderCell>
            <Table.HeaderCell>Postal Code</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {addresses.length > 0 ? (
            addresses.map((address) => (
              <Table.Row key={address.id}>
                <Table.Cell>{address.address_1 || "-"}</Table.Cell>
                <Table.Cell>{address.address_2 || "-"}</Table.Cell>
                <Table.Cell>{address.city || "-"}</Table.Cell>
                <Table.Cell>
                  {address.country_code?.toUpperCase() || "-"}
                </Table.Cell>
                <Table.Cell>{address.postal_code || "-"}</Table.Cell>
                <Table.Cell>
                  <ActionMenu
                    groups={[
                      {
                        actions: [
                          {
                            label: "Edit",
                            icon: <PencilSquare />,
                            to: `edit-address`,
                          },
                        ],
                      },
                      {
                        actions: [
                          {
                            label: "Delete",
                            icon: <Trash />,
                            onClick: () => handleDelete(address.id),
                          },
                        ],
                      },
                    ]}
                  />
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell>
                <div className="flex w-full justify-center py-4">
                  <Text className="text-ui-fg-subtle">No addresses found</Text>
                </div>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </Container>
  )
}

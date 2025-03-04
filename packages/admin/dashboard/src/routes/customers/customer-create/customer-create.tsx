import { ProgressTabs, ProgressStatus } from "@medusajs/ui"
import { useState } from "react"

import { RouteFocusModal } from "../../../components/modals"
import { CreateCustomerForm } from "./components/create-customer-form"
import { CreateCustomerAddressForm } from "./components/create-customer-address-form"

enum Tab {
  DETAILS = "details",
  ADDRESS = "address",
}

type TabState = Record<Tab, ProgressStatus>

export const CustomerCreate = () => {
  const [tab, setTab] = useState<Tab>(Tab.DETAILS)
  const [tabState, setTabState] = useState<TabState>({
    [Tab.DETAILS]: "in-progress",
    [Tab.ADDRESS]: "not-started",
  })
  const [customerId, setCustomerId] = useState<string>()

  const handleDetailsSubmit = (id: string) => {
    setCustomerId(id)
    setTab(Tab.ADDRESS)
    setTabState({
      [Tab.DETAILS]: "completed",
      [Tab.ADDRESS]: "in-progress",
    })
  }

  return (
    <RouteFocusModal>
      <ProgressTabs
        value={tab}
        onValueChange={(value) => setTab(value as Tab)}
        className="flex-1"
      >
        <ProgressTabs.List>
          <ProgressTabs.Trigger
            value={Tab.DETAILS}
            status={tabState[Tab.DETAILS]}
          >
            Customer Details
          </ProgressTabs.Trigger>
          <ProgressTabs.Trigger
            value={Tab.ADDRESS}
            status={tabState[Tab.ADDRESS]}
          >
            Address Information
          </ProgressTabs.Trigger>
        </ProgressTabs.List>
        <ProgressTabs.Content value={Tab.DETAILS}>
          <CreateCustomerForm onSubmit={handleDetailsSubmit} />
        </ProgressTabs.Content>
        <ProgressTabs.Content value={Tab.ADDRESS}>
          {customerId && <CreateCustomerAddressForm customerId={customerId} />}
        </ProgressTabs.Content>
      </ProgressTabs>
    </RouteFocusModal>
  )
}

import React, { useEffect, useMemo, useRef, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import {} from "../../../../../../../../core/js-sdk/dist/esm/admin/stock-location"
import { geocodeAddress } from "./constants"
import { AdminStockLocation } from "@medusajs/types"

type Coordinates = {
  lat: number
  lng: number
}

type OrderCreateFulfillmentMapProps = {
  stockLocation: AdminStockLocation
  deliveryLocation: Coordinates
}

export const OrderCreateFulfillmentMap: React.FC<
  OrderCreateFulfillmentMapProps
> = ({ deliveryLocation, stockLocation }) => {
  const [warehouseCoordinates, setWarehouseCoordinates] =
    useState<Coordinates | null>(null)

  useMemo(async () => {
    if (stockLocation && stockLocation.address) {
      const coordinates = await geocodeAddress(stockLocation.address?.address_1)
      if (coordinates && coordinates.lat && coordinates.lng) {
        setWarehouseCoordinates({
          lat: coordinates.lat,
          lng: coordinates.lng,
        })
      }
    }
  }, [stockLocation])

  if (!warehouseCoordinates) {
    return null
  }

  console.log(stockLocation, warehouseCoordinates, deliveryLocation)
  return (
    <div>
      {deliveryLocation && warehouseCoordinates && (
        <OrderCreateFulfillmentMapComplete
          warehouseLocation={warehouseCoordinates}
          deliveryLocation={deliveryLocation}
        />
      )}
    </div>
  )
}

type OrderCreateFulfillmentMapCompleteProps = {
  warehouseLocation: Coordinates
  deliveryLocation: Coordinates
}

export const OrderCreateFulfillmentMapComplete: React.FC<
  OrderCreateFulfillmentMapCompleteProps
> = ({ warehouseLocation, deliveryLocation }) => {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapContainerRef.current) {
      return
    }

    // Initialize the map with center point
    const centerLat = (warehouseLocation.lat + deliveryLocation.lat) / 2
    const centerLng = (warehouseLocation.lng + deliveryLocation.lng) / 2

    mapRef.current = L.map(mapContainerRef.current).setView(
      [centerLat, centerLng],
      10
    )

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
    }).addTo(mapRef.current)

    // Create a red icon for delivery location
    const redIcon = new L.Icon({
      iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    })

    // Add markers for both locations
    L.marker([warehouseLocation.lat, warehouseLocation.lng]).addTo(
      mapRef.current
    )
    L.marker([deliveryLocation.lat, deliveryLocation.lng], {
      icon: redIcon,
    }).addTo(mapRef.current)

    // Fit bounds to show both markers
    const bounds = L.latLngBounds(
      [warehouseLocation.lat, warehouseLocation.lng],
      [deliveryLocation.lat, deliveryLocation.lng]
    )
    mapRef.current.fitBounds(bounds, { padding: [50, 50] })

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
      }
    }
  }, [warehouseLocation, deliveryLocation])

  return (
    <div>
      <div
        ref={mapContainerRef}
        className="h-[350px] w-full overflow-hidden rounded-lg"
      />
      <div className="text-grey-50 mt-2 flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-blue-500" />
          <span>Stock Location</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500" />
          <span>Delivery Location</span>
        </div>
      </div>
    </div>
  )
}

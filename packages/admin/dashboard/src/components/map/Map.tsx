import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

interface MapProps {
  coordinates: [number, number] // [latitude, longitude]
  secondaryCoordinates?: [number, number] // Optional second marker coordinates
  zoom?: number
  className?: string
}

export const Map = ({
  coordinates,
  secondaryCoordinates,
  zoom = 13,
  className = "",
}: MapProps) => {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Clean up existing map instance if it exists
    if (mapRef.current) {
      mapRef.current.remove()
      mapRef.current = null
    }

    if (coordinates.filter((coord) => !!coord).length !== 2) {
      return
    }

    if (!mapContainerRef.current) {
      return
    }

    // Initialize the map
    mapRef.current = L.map(mapContainerRef.current).setView(coordinates, zoom)

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
    }).addTo(mapRef.current)

    // Add a marker at the coordinates
    L.marker(coordinates).addTo(mapRef.current)

    // Add a blue marker for secondary coordinates if provided
    if (
      secondaryCoordinates &&
      secondaryCoordinates.filter((coord) => !!coord).length === 2
    ) {
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
      L.marker(secondaryCoordinates, { icon: redIcon }).addTo(mapRef.current)
      if (secondaryCoordinates) {
        const bounds = L.latLngBounds(coordinates, secondaryCoordinates)
        mapRef.current.fitBounds(bounds, { padding: [50, 50] })
      }
      // L.marker(secondaryCoordinates, {
      //   icon: L.divIcon({
      //     className: "custom-div-icon",
      //     html: `<div style="background-color: #0066cc; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`,
      //     iconSize: [12, 12],
      //     iconAnchor: [6, 6],
      //   }),
      // }).addTo(mapRef.current)
    }

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [coordinates, secondaryCoordinates, zoom, mapContainerRef])

  return (
    <div
      ref={mapContainerRef}
      className={`z-0 h-[400px] w-full ${className}`}
    />
  )
}

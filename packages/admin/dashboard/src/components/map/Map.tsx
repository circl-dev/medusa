import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

interface MapProps {
  coordinates: [number, number] // [latitude, longitude]
  zoom?: number
  className?: string
}

export const Map = ({ coordinates, zoom = 13, className = "" }: MapProps) => {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
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
        "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors",
    }).addTo(mapRef.current)

    // Add a marker at the coordinates
    L.marker(coordinates).addTo(mapRef.current)

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
      }
    }
  }, [coordinates, zoom])

  return <div ref={mapContainerRef} className={`h-[400px] w-full z-0 ${className}`} />
} 
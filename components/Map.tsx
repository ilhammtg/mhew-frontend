"use client";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix icon leaflet yang sering hilang di Next.js
const icon = L.icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

// Fungsi untuk memindahkan kamera peta otomatis
function ChangeView({ center }: { center: [number, number] }) {
    const map = useMap();
    map.setView(center, 8);
    return null;
}

export default function Map({ lat, lon, wilayah }: { lat: number, lon: number, wilayah: string }) {
    const position: [number, number] = [lat, lon];

    return (
        <MapContainer center={position} zoom={8} style={{ height: "100%", width: "100%", borderRadius: "2rem" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <ChangeView center={position} />
            <Marker position={position} icon={icon}>
                <Popup>{wilayah}</Popup>
            </Marker>
        </MapContainer>
    );
}
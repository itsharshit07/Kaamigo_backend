import React from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const MapWithDirection = ({ userCoords, workerCoords }) => {
  const center = [
    (userCoords.lat + workerCoords.lat) / 2,
    (userCoords.lng + workerCoords.lng) / 2,
  ];

  const userIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    iconSize: [30, 30],
  });

  const workerIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/190/190411.png",
    iconSize: [30, 30],
  });

  return (
    <div className="h-64 w-full mt-3 rounded-lg overflow-hidden shadow">
      <MapContainer center={center} zoom={10} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[userCoords.lat, userCoords.lng]} icon={userIcon}>
          <Popup>You are here</Popup>
        </Marker>
        <Marker position={[workerCoords.lat, workerCoords.lng]} icon={workerIcon}>
          <Popup>Worker's Location</Popup>
        </Marker>
        <Polyline
          positions={[
            [userCoords.lat, userCoords.lng],
            [workerCoords.lat, workerCoords.lng],
          ]}
          color="blue"
        />
      </MapContainer>
    </div>
  );
};

export default MapWithDirection;

import React, { useEffect, useState } from 'react';
import { IonContent, IonPage, IonHeader, IonTitle, IonToolbar } from '@ionic/react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L, { LatLngTuple } from 'leaflet';

export interface ILocationCord {
    longitude: number;
    latitude: number;
}

export interface ILocationVisualizerProps {
    targetLocation?: ILocationCord;
    currentLocation: ILocationCord;
}

const LocationMap = ({currentLocation, targetLocation}: ILocationVisualizerProps) => {

    const currentPosition: LatLngTuple = [currentLocation.latitude, currentLocation.longitude];
  const markerIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My Location</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div style={{ width: '100%', height: '100vh' }}>
          {currentLocation ? (
            <MapContainer center={currentPosition} zoom={16} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={currentPosition} icon={markerIcon}>
                <Popup>Your current location</Popup>
              </Marker>
            </MapContainer>
          ) : (
            <p style={{ textAlign: 'center', marginTop: '50%' }}>Getting your location...</p>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LocationMap;

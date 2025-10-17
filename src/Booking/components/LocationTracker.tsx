import React, { useEffect, useRef, useState } from 'react';
import { IonPage, IonContent, IonHeader, IonTitle, IonToolbar, IonRange, IonLabel, useIonViewDidEnter, useIonViewDidLeave } from '@ionic/react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { Geolocation } from '@capacitor/geolocation';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ILocationCord } from './LocationVisualizer';
import { useGeoLocationStore } from '../hooks/location';

export interface ILocationTrackerProps {
    targetLocation: ILocationCord;
}
const LocationTracker = ({targetLocation}: ILocationTrackerProps) => {
    const {getLocationCords} = useGeoLocationStore();

    const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [zoom, setZoom] = useState(13);

  const reloadMapTimerRef = useRef<unknown>();

  const targetPos: [number, number] = [targetLocation.latitude, targetLocation.longitude];

  // Custom marker icons
  const userIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconAnchor: [12, 41],
    iconSize: [25, 41],
  });

  const targetIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // example red pin
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });
const getLocation = async () => {
        const pos = await getLocationCords();
        if(pos) setUserPos([pos.latitude, pos.longitude]);
    };

  useEffect(() => {
    getLocation();
  }, []);

  useIonViewDidEnter(() => {
    reloadMapTimerRef.current =  setInterval(() => {
        getLocation();
    }, 5000);
  }, []);

  useIonViewDidLeave(() => {
    clearInterval(reloadMapTimerRef.current as number)
  }, [])
  return (
    <>
    
        <div style={{ height: '85vh', width: '100%' }}>
          {userPos ? (
            <MapContainer
              center={userPos}
              zoom={zoom}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* User Marker */}
              <Marker position={userPos} icon={userIcon}>
                <Popup>You are here</Popup>
              </Marker>

              {/* Target Marker */}
              <Marker position={targetPos} icon={targetIcon}>
                <Popup>Target Location</Popup>
              </Marker>

              {/* Draw a circle showing user's position range */}
              <Circle center={userPos} radius={50} color="blue" />

            </MapContainer>
          ) : (
            <p style={{ textAlign: 'center', marginTop: '40%' }}>Getting your location...</p>
          )}
        </div>

        {/* Zoom control slider */}
        <div style={{ padding: '1rem' }}>
          <IonLabel>Zoom: {zoom}</IonLabel>
          <IonRange
            min={5}
            max={18}
            step={1}
            value={zoom}
            onIonChange={(e) => setZoom(e.detail.value as number)}
          ></IonRange>
        </div>

    </>
  );
};

export default LocationTracker;

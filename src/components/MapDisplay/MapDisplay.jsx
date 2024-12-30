import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import styles from "./MapDisplay.module.css";
import HomeIcon from "../../icons/HomeIcon";
import "leaflet/dist/leaflet.css"; 

const MapDisplay = ({ lat, lng, address, addressDescription }) => {

  const position = [lat, lng]; 

  return (
    <div className={styles.mainContainer}>
    <MapContainer
      center={position} 
      zoom={12} 
      className={styles.mainMap}
      scrollWheelZoom={false} 
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          <div className={styles.imgContainer}>
            <HomeIcon width={30} height={30} />
          </div>
          {address} <br />
          {addressDescription}
        </Popup>
      </Marker>
    </MapContainer>
  </div>
  );
};

export default MapDisplay;

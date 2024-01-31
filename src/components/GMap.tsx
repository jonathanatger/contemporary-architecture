import { ReactElement, useEffect, useRef, useState } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import mapStyle from "./MapStyle.json";
let MAPS_KEY = import.meta.env.VITE_MAPS_KEY;

interface MapsComponentInterface {
  center: google.maps.LatLngLiteral;
  zoom: number;
}

const center1 = { lat: -34.397, lng: 150.644 };
const zoom1 = 8;

const MapsComponent = function ({
  center,
  zoom,
}: MapsComponentInterface): React.JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    if (ref.current && !map) {
      setMap(
        new window.google.maps.Map(ref.current, {
          center: center,
          zoom: zoom,
        })
      );
    }
  }, [ref, map]);

  return <div ref={ref} className="w-full h-full"></div>;
};

const render = function (status: Status): ReactElement {
  if (status === Status.SUCCESS)
    return (
      <div className="h-full w-full">
        <MapsComponent center={center1} zoom={zoom1} />
      </div>
    );
  else return <h3>{status}</h3>;
};

export const GoogleMap = function () {
  return <Wrapper apiKey={MAPS_KEY} render={render}></Wrapper>;
};

// export const GoogleMap = () => {
//   const [map, setMap] = useState<google.maps.Map | null>(null);

//   useEffect(() => {
//     // Load the Google Maps JavaScript API script
//     const script = document.createElement("script");
//     script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_KEY}&callback=initMap`;
//     script.async = true;
//     window.initMap = initMap;
//     document.body.appendChild(script);

//     // Initialize the map
//     function initMap() {
//       const google = window.google;
//       const mapInstance = new google.maps.Map(document.getElementById("map"), {
//         center: { lat: 37.7749, lng: -122.4194 }, // Default center (San Francisco)
//         zoom: 12, // Default zoom level
//       });
//       setMap(mapInstance);
//     }

//     return () => {
//       // Clean up function to remove the script and event listener
//       document.body.removeChild(script);
//       window.removeEventListener("initMap", initMap);
//     };
//   }, []);

//   return (
//     <div id="map" className="w-full h-full">
//       Loading map...
//     </div>
//   );
// };

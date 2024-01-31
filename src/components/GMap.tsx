import { ReactElement, useEffect, useRef, useState } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import mapStyle from "./gmapcomponents/MapStyle.json";
import { useMarkers } from "./gmapcomponents/Marker.js";
import { useFetch } from "./gmapcomponents/dataFetching";
let MAPS_KEY = import.meta.env.VITE_MAPS_KEY;

interface MapsComponentInterface {
  center: google.maps.LatLngLiteral;
  zoom: number;
  style?: google.maps.MapTypeStyle[];
}

//iniating the placement of the map
const center1 = { lat: 46.2141033633116, lng: 5.23390479986328 };
const zoom1 = 12;

// Component defining the logic around the Map item
const MapsComponent = function ({
  center,
  zoom,
  style,
}: MapsComponentInterface): React.JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [url, setUrl] = useState<string>(
    "https://data.culture.gouv.fr/api/explore/v2.1/catalog/datasets/liste-des-edifices-labellises-architecture-contemporaine-remarquable-acr/records?where=auteurs_pour_pop_autr%3D%22Pinsard%20Pierre%20(architecte)%22&limit=20"
  );

  useEffect(() => {
    if (ref.current && !map) {
      setMap(
        new window.google.maps.Map(ref.current, {
          center: center,
          zoom: zoom,
          styles: style,
        })
      );
    }
  }, [ref, map]);

  const { data, loading, error } = useFetch(url);

  useMarkers(map, data, loading);

  return <div ref={ref} className="h-full w-full" />;
};

// Checks if the Map loaded and displays a status report if not
const render = function (status: Status): ReactElement {
  if (status === Status.SUCCESS)
    return (
      <div className="h-full w-full">
        <MapsComponent center={center1} zoom={zoom1} style={mapStyle} />
      </div>
    );
  else return <h3>{status}</h3>;
};

// Wrapper component makes the call to the Google Maps API and renders the render component
export const GoogleMap = function () {
  return <Wrapper apiKey={MAPS_KEY} render={render}></Wrapper>;
};

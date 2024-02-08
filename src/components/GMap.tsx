import { ReactElement, useEffect, useRef, useState } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { useMarkers } from "./gmapcomponents/Markers.js";
import { useFetch } from "./gmapcomponents/dataFetching";
import { Info } from "./gmapcomponents/Info.js";
import { AdressSelector } from "./gmapcomponents/AdressSelector.js";
import data from "../../data.json";

let MAPS_KEY = import.meta.env.VITE_MAPS_KEY;

//iniating the placement of the map
let firstMapCenter: google.maps.LatLngLiteral = {
  lat: 46.227638,
  lng: 1.7191036,
};
let firstZoom: number = 6;

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition((pos) => {
    firstMapCenter = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    firstZoom = 12;
  });
}

// Component defining the logic around the Map item
const MapsComponent = function (): React.JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isAdditionalInfoDisplayed, setIsAdditionalInfoDisplayed] =
    useState(false);
  const [additionalInfoDisplayed, setAdditionalInfoDisplayed] = useState({
    titre: "",
    adress: "",
    date: "",
    architect: "",
    description: "",
  });

  // Setting up the map
  useEffect(() => {
    if (ref.current && !map) {
      setMap(
        new window.google.maps.Map(ref.current, {
          center: firstMapCenter,
          zoom: firstZoom,
          mapId: "fb0ed05d8f32c234",
          zoomControl: true,
          mapTypeControl: false,
          scaleControl: false,
          streetViewControl: true,
          rotateControl: false,
          fullscreenControl: false,
        })
      );
    }
  }, [ref, map]);

  // Fetching the data to display
  // const { data, loading, error } = useFetch();
  let loading = false;
  let error = false;
  //==========================================================================================

  // isolating the Marker logic
  const { currentHighlightedMarkerElement, changeMarkerHighlight } = useMarkers(
    map,
    data,
    loading,
    setAdditionalInfoDisplayed,
    setIsAdditionalInfoDisplayed
  );

  return (
    <div className="relative h-full w-full">
      <div ref={ref} className="h-full w-full top-0 left-0 absolute" />
      {isAdditionalInfoDisplayed && (
        <Info
          info={additionalInfoDisplayed}
          setAdditionalInfoDisplayed={setIsAdditionalInfoDisplayed}
          currentHighlightedMarkerElement={currentHighlightedMarkerElement}
          changeMarkerHighlight={changeMarkerHighlight}
        />
      )}
      {error && (
        <h1 className="fixed text-3xl bg-red-800 top-0 m-2">{error}</h1>
      )}
      <AdressSelector map={map} />
    </div>
  );
};

// Checks if the Map loaded and displays a status report if not
const render = function (status: Status): ReactElement {
  if (status === Status.SUCCESS)
    return (
      <div className="h-full w-full">
        <MapsComponent />
      </div>
    );
  else return <h3>{status}</h3>;
};

// Wrapper component makes the call to the Google Maps API and renders the render component
export const GoogleMap = function () {
  return <Wrapper apiKey={MAPS_KEY} render={render}></Wrapper>;
};

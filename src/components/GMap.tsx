import { ReactElement, useContext, useEffect, useRef, useState } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { useMarkers } from "./gmapcomponents/Markers.js";
import { useFetch } from "./gmapcomponents/dataFetching";
import { useImports } from "./gmapcomponents/mapsImports.js";
import { InfoDisplay } from "./gmapcomponents/Info.js";
import { AdressSelector } from "./gmapcomponents/AdressSelector.js";
import {
  BuildingInfoType,
  SimplifiedBuildingInfoType,
} from "./gmapcomponents/buildingDatatype.js";
import data from "../../data.json";
import { menuVisibleContext } from "../App.js";

let simplifiedData = data as SimplifiedBuildingInfoType[];
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
  const [apiImportsLoading, setApiImportsLoading] = useState(true);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const HTMLreference = useRef<HTMLDivElement>(null);
  const [isAdditionalInfoDisplayed, setIsAdditionalInfoDisplayed] =
    useState(false);
  const [additionalInfoDisplayed, setAdditionalInfoDisplayed] = useState({
    titre: "",
    adresse: "",
    date: "",
    auteur: "",
    description: "",
    coordonnees: null,
  } as BuildingInfoType | null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<null | string>(null);
  const [reference, setReference] = useState("");
  const menuVisibleContextObject = useContext(menuVisibleContext);

  // Additional imports of the google maps Api handled here
  useImports(setApiImportsLoading, setError);

  // Setting up the map
  useEffect(() => {
    if (HTMLreference.current && !map) {
      setMap(
        new window.google.maps.Map(HTMLreference.current, {
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
  }, []);

  //adding a listener to hide the menu when going into Street View
  useEffect(() => {
    if (!map) return;

    google.maps.event.addListener(
      map.getStreetView(),
      "visible_changed",
      function () {
        if (menuVisibleContextObject.dispatch)
          menuVisibleContextObject.dispatch((prev) => !prev);
      }
    );

    return () => {
      // no way to remove the listener in the API
    };
  }, [map]);

  // isolating the Marker logic
  const { currentHighlightedMarkerElement, changeMarkerHighlight } = useMarkers(
    map,
    simplifiedData,
    setIsAdditionalInfoDisplayed,
    setReference,
    apiImportsLoading
  );

  // data fetching logic
  useFetch(reference, setLoading, setError, setAdditionalInfoDisplayed);

  return (
    <div className="relative h-full w-full">
      <div
        ref={HTMLreference}
        className="h-full w-full top-0 left-0 absolute"
      />

      {isAdditionalInfoDisplayed && (
        <InfoDisplay
          info={additionalInfoDisplayed}
          setAdditionalInfoDisplayed={setIsAdditionalInfoDisplayed}
          currentHighlightedMarkerElement={currentHighlightedMarkerElement}
          changeMarkerHighlight={changeMarkerHighlight}
          loading={loading}
        />
      )}

      {error && (
        <h1 className="fixed text-sm bg-red-800 top-0 m-2 rounded-sm">
          Erreur : {error}
        </h1>
      )}

      {menuVisibleContextObject.visible && (
        <AdressSelector map={map} apiImportsLoading={apiImportsLoading} />
      )}
    </div>
  );
};

// Checks if the Map loaded and displays a loading screen if not
const MapRenderer = function (status: Status): ReactElement {
  if (status === Status.SUCCESS)
    return (
      <div className="h-full w-full">
        <MapsComponent />
      </div>
    );
  return (
    <div role="status" className="flex flex-col justify-center items-center">
      <svg
        className="w-8 h-8 text-gray-600 animate-spin dark:text-gray-600 fill-blue-600"
        viewBox="0 0 100 101"
        fill=""
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill=""
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill=""
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

// Wrapper component makes the call to the Google Maps API and renders the render component
export const GoogleMap = function () {
  return <Wrapper apiKey={MAPS_KEY} render={MapRenderer}></Wrapper>;
};

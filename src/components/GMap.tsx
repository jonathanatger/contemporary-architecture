import { ReactElement, useContext, useEffect, useRef, useState } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { useMarkers } from "./gmapcomponents/Markers.js";
import { useUserLocation } from "./gmapcomponents/userLocation.js";
import { useFetch } from "./gmapcomponents/dataFetching";
import { useImports } from "./gmapcomponents/mapsImports.js";
import { InfoDisplay } from "./gmapcomponents/InfoDisplay.js";
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
  const [apiImportsAreLoading, setApiImportsAreLoading] = useState(true);
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

  useImports(setApiImportsAreLoading, setError);

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

  useEffect(() => {
    if (!map) return;

    google.maps.event.addListener(
      map.getStreetView(),
      "visible_changed",
      function () {
        if (menuVisibleContextObject.setMenuVisible)
          menuVisibleContextObject.setMenuVisible((visible) => !visible);
      }
    );

    return () => {
      // no way to remove the listener in the API
    };
  }, [map]);

  const { currentHighlightedMarkerElement, changeMarkerHighlight } = useMarkers(
    map,
    simplifiedData,
    setIsAdditionalInfoDisplayed,
    setReference,
    apiImportsAreLoading
  );

  useUserLocation(map, apiImportsAreLoading);

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
        <h1 className="fixed text-sm bg-amber-800 top-96 m-2 rounded-sm">
          Erreur : {error}
        </h1>
      )}

      {menuVisibleContextObject.visible && (
        <AdressSelector map={map} apiImportsAreLoading={apiImportsAreLoading} />
      )}
    </div>
  );
};

// Checks if the Map loaded and displays a blank element if not
// Loading screen is separate so that it appears before the Google maps component makes its requests, as soon as the website first loads
const MapRenderer = function (status: Status): ReactElement {
  if (status === Status.SUCCESS)
    return (
      <div className="h-full w-full">
        <MapsComponent />
      </div>
    );
  return <div></div>;
};

// Wrapper component makes the call to the Google Maps API and renders the chosen component
export const GoogleMap = function () {
  return <Wrapper apiKey={MAPS_KEY} render={MapRenderer}></Wrapper>;
};

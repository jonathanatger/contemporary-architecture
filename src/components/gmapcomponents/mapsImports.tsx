import React, { useEffect } from "react";

async function initMarkersApi(): Promise<void> {
  // @ts-ignore
  const { AdvancedMarkerElement, PinElement } =
    (await google.maps.importLibrary("marker")) as google.maps.MarkerLibrary;
}

async function initPlacesApi(): Promise<void> {
  // @ts-ignore
  const { Autocomplete, PlaceResult, AutocompleteService, PlacesService } =
    (await google.maps.importLibrary("places")) as google.maps.PlacesLibrary;
}

export const useImports = function (
  setApiImportsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) {
  useEffect(() => {
    const markerPromise = initMarkersApi();
    const placesPromise = initPlacesApi();

    Promise.all([markerPromise, placesPromise])
      .then(() => {
        setApiImportsLoading(false);
      })
      .catch((error) => {
        setError(error);
      });
  }, []);
};

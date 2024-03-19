import { argv } from "process";
import { useEffect } from "react";

let autocomplete: google.maps.places.Autocomplete | null;
let service: google.maps.places.AutocompleteService | null;

export function AdressSelector({
  map,
  apiImportsAreLoading,
}: {
  map: google.maps.Map | null;
  apiImportsAreLoading: boolean;
}) {
  // after api Imports resolve, launch the search service
  useEffect(() => {
    if (apiImportsAreLoading) return;
    service = new google.maps.places.AutocompleteService();

    // First way to set the map at a given adress : Creating an autocomplete window
    // the user will get results on, and be able to click on them
    const input = document.getElementById("adress-input") as HTMLInputElement;

    const autocompleteOptions = {
      fields: ["formatted_address", "geometry", "name"],
      strictBounds: false,
    };

    autocomplete = new google.maps.places.Autocomplete(
      input,
      autocompleteOptions
    );

    if (map) {
      autocomplete.bindTo("bounds", map);
    }

    autocomplete.setTypes(["(cities)"]);

    autocomplete.addListener("place_changed", () => {
      const placeResult =
        autocomplete?.getPlace() as google.maps.places.PlaceResult;

      setMapsOnChosenAdress(map, placeResult);
    });
  }, [apiImportsAreLoading]);

  // Second method to set the map on a given adress :
  // on button click, this will fire and try to match the adress given by the user
  // and set the map on the most likely address
  function goToAdressOnEvent() {
    const adressInput = document.getElementById(
      "adress-input"
    ) as HTMLInputElement;
    const adressInputValue: string = adressInput.value;

    service?.getPlacePredictions({ input: adressInputValue }, serviceCallback);

    function serviceCallback(
      predictions: google.maps.places.AutocompletePrediction[] | null,
      status: google.maps.places.PlacesServiceStatus
    ) {
      if (status != google.maps.places.PlacesServiceStatus.OK) {
        alert(status);
        return;
      }

      if (!predictions || !map) return;
      const placeService = new google.maps.places.PlacesService(map);
      placeService.getDetails(
        {
          placeId: predictions[0].place_id,
          fields: ["name", "geometry"],
          region: "fr",
        },
        detailsCallback
      );
    }

    function detailsCallback(
      placeResult: google.maps.places.PlaceResult | null,
      status: google.maps.places.PlacesServiceStatus
    ) {
      if (status != google.maps.places.PlacesServiceStatus.OK) {
        alert(status);
        return;
      }

      setMapsOnChosenAdress(map, placeResult);

      const input = document.getElementById("adress-input") as HTMLInputElement;
      if (placeResult && placeResult.name) input.value = placeResult?.name;
    }
  }

  function setMapsOnChosenAdress(
    map: google.maps.Map | null,
    placeResult: google.maps.places.PlaceResult | null
  ) {
    if (!map || !placeResult) return;

    const locationCoords = placeResult.geometry?.location;
    if (!locationCoords) return;
    map.panTo(locationCoords);
    smoothZoom(map, 14, map.getZoom());
  }

  function onEnterKeyPressed(e: any) {
    if (e.keyCode === 13) goToAdressOnEvent();
  }

  return (
    <div className="absolute flex flex-row justify-center items-start  w-full h-full pointer-events-none ">
      <div
        id="pac-container"
        className="grow flex justify-between items-center bg-white mx-4 mt-32 p-1 max-w-screen-md shadow-lg rounded-md pointer-events-auto  z-50">
        <input
          id="adress-input"
          name="adress-input"
          type="text"
          placeholder="Aller à..."
          className="min-w-60 h-8 text-sm "
          onKeyDown={onEnterKeyPressed}
          required
        />
        <button
          id="adress-input-button"
          onClick={goToAdressOnEvent}
          className="p-2 whitespace-nowrap min-w-16 truncate border-2 rounded-sm shadow-none text-sm text-gray-800 border-amber-300 hover:border-amber-600">
          Go !
        </button>
      </div>
    </div>
  );
}

function smoothZoom(
  map: google.maps.Map,
  maxZoom: number,
  currentZoom: number | undefined
) {
  if (currentZoom === undefined) return;
  let zoomEventListener: google.maps.MapsEventListener;
  if (currentZoom >= maxZoom) {
    return;
  } else {
    //@ts-ignore
    zoomEventListener = google.maps.event.addListener(
      map,
      "zoom_changed",
      function () {
        google.maps.event.removeListener(zoomEventListener);
        smoothZoom(map, maxZoom, currentZoom + 1);
      }
    );
    setTimeout(function () {
      map.setZoom(currentZoom);
    }, 80);
  }
}

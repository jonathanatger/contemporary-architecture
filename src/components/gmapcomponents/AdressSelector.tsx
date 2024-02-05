import { MouseEventHandler, useEffect } from "react";
async function initPlacesApi(): Promise<void> {
  // @ts-ignore
  const { Autocomplete, PlaceResult, AutocompleteService, PlacesService } =
    (await google.maps.importLibrary("places")) as google.maps.PlacesLibrary;
}

let autocomplete: google.maps.places.Autocomplete | null;
let service: google.maps.places.AutocompleteService | null;

export function AdressSelector({ map }: { map: google.maps.Map | null }) {
  useEffect(() => {
    initPlacesApi().then(() => {
      service = new google.maps.places.AutocompleteService();

      setupAutocompleteDropdownOnInput();
    });

    return () => {
      //No method in the api to remove the listener on the Autocomplete object
      // otherwise it would be here
    };
  }, []);

  // First way to set the map at a given adress : Creating an autocomplete window
  // the user will get results on, and be able to click on them
  function setupAutocompleteDropdownOnInput() {
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
      //@ts-ignore
      autocomplete.bindTo("bounds", map);
    }

    autocomplete.setTypes(["(cities)"]);

    autocomplete.addListener("place_changed", () => {
      const placeResult =
        autocomplete?.getPlace() as google.maps.places.PlaceResult;

      setMapsOnChosenAdress(map, placeResult);
    });
  }

  // Second method to set the map on a given adress : on button click, this will fire and try to match the adress given by the user
  // and set the map on the most likely address
  function goToAdressOnEvent(e: any) {
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

  // zooms on the chose adress / location decided by the user
  // once it has been identified
  function setMapsOnChosenAdress(
    map: google.maps.Map | null,
    placeResult: google.maps.places.PlaceResult | null
  ) {
    if (!map || !placeResult) return;

    if (placeResult.geometry?.viewport) {
      map.fitBounds(placeResult.geometry.viewport);
    } else {
      const locationCoords = placeResult.geometry?.location;
      if (!locationCoords) return;
      map.setCenter(locationCoords);
      map.setZoom(17);
    }
  }

  function onEnterKeyPressed(e: any) {
    if (e.keyCode === 13) goToAdressOnEvent(e);
  }

  return (
    <div className="absolute w-full h-full flex flex-col justify-start items-center pointer-events-none">
      <div
        id="pac-container"
        className="w-5/6 bg-white mt-2 p-2 shadow-lg rounded-md pointer-events-auto">
        <input
          id="adress-input"
          name="adress-input"
          type="text"
          placeholder="Aller à..."
          className="w-5/6 h-8"
          onKeyDown={onEnterKeyPressed}
          required
        />
        <button
          id="adress-input-button"
          onClick={goToAdressOnEvent}
          className="w-1/6 border-b-neutral-950 border-2 rounded-sm">
          Go
        </button>
      </div>
    </div>
  );
}

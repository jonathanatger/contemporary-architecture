import { MouseEventHandler, useEffect } from "react";
async function initPlacesApi(): Promise<void> {
  // @ts-ignore
  const { Autocomplete, PlaceResult, AutocompleteService, PlacesService } =
    (await google.maps.importLibrary("places")) as google.maps.PlacesLibrary;
}

// this is a comment

let autocomplete: google.maps.places.Autocomplete;

export function AdressSelector({ map }: { map: google.maps.Map | null }) {
  useEffect(() => {
    initPlacesApi().then(() => {
      const autocompleteOptions = {
        fields: ["formatted_address", "geometry", "name"],
        strictBounds: false,
      };

      const input = document.getElementById("adress-input") as HTMLInputElement;

      autocomplete = new google.maps.places.Autocomplete(
        input,
        autocompleteOptions
      );

      if (map) {
        //@ts-ignore
        autocomplete.bindTo("bounds", map);
      }

      autocomplete.setTypes(["(cities)"]);

      // In case user clicks on a result of the dropdown menu, it is passed here
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace() as google.maps.places.PlaceResult;
        if (!map) return;

        if (place.geometry?.viewport) {
          map.fitBounds(place.geometry.viewport);
        } else {
          const locationCoords = place.geometry?.location;
          if (!locationCoords) return;
          map.setCenter(locationCoords);
          map.setZoom(17);
        }
      });
    });

    return () => {
      //No method in the api to remove the listener on the Autocomplete object
    };
  }, []);

  // on button click, this will fire and try to match the adress given by the user
  // and set the map on the most likely address
  function validateAndGoToAdress(e: any) {
    const adressInput = document.getElementById(
      "adress-input"
    ) as HTMLInputElement;
    const adressInputValue: string = adressInput.value;

    const service = new google.maps.places.AutocompleteService();
    service.getPlacePredictions({ input: adressInputValue }, callback);

    function callback(
      predictions: google.maps.places.AutocompletePrediction[] | null,
      status: google.maps.places.PlacesServiceStatus
    ) {
      // in case of an error
      if (status != google.maps.places.PlacesServiceStatus.OK) {
        alert(status);
        return;
      }

      // Take the first result.
      if (!predictions || !map) return;
      const placeService = new google.maps.places.PlacesService(map);
      const place = placeService.getDetails(
        { placeId: predictions[0].place_id },
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
      // to detail
      console.log(placeResult);
    }
  }

  function setMapsOnChosenAdress() {}

  return (
    <div className="absolute w-full flex justify-center">
      <div id="pac-container" className="w-5/6 bg-white mt-2 p-2">
        <input
          id="adress-input"
          name="adress-input"
          type="text"
          placeholder="Aller à..."
          className="w-5/6 h-8"
          required
        />
        <button
          id="adress-input-button"
          onClick={validateAndGoToAdress}
          className="w-1/6 border-b-neutral-950 border-2 rounded-sm">
          Go
        </button>
      </div>
    </div>
  );
}

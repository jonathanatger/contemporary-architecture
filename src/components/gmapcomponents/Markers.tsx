import { useEffect, useState, useRef, MutableRefObject } from "react";
import { buildingData, BuildingInfoContextType } from "./buildingDatatype";
import { MarkerClusterer } from "@googlemaps/markerclusterer";

async function initMarker(): Promise<void> {
  // @ts-ignore
  const { AdvancedMarkerElement, PinElement } =
    (await google.maps.importLibrary("marker")) as google.maps.MarkerLibrary;
}

export function useMarkers(
  map: google.maps.Map | null,
  // cleanedData: buildingData[],
  cleanedData: any,
  // loading: boolean,
  setInfoDisplayed: React.Dispatch<
    React.SetStateAction<BuildingInfoContextType>
  >,
  setIsAdditionalInfoDisplayed: React.Dispatch<React.SetStateAction<boolean>>
) {
  // const infoWindow = new google.maps.InfoWindow();
  const [markers, setMarkers] = useState<
    google.maps.marker.AdvancedMarkerElement[]
  >([]);
  const currentHighlightedMarkerElement =
    useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initMarker().then((res) => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!cleanedData || isLoading) return;

    let markersArray = [];
    for (const building of cleanedData) {
      // if (building.coordonnees === null) continue;
      if (building.position === null) continue;

      let markerElement = new google.maps.marker.AdvancedMarkerElement({
        position: {
          lat: building.position.lat,
          lng: building.position.lon,
        },
        map: map,
        content: buildInfoTextBox(1),
      });

      markerElement.addListener("click", () => {
        changeMarkerHighlight(
          markerElement,
          currentHighlightedMarkerElement,
          setIsAdditionalInfoDisplayed
        );
        setInfoDisplayed({
          titre: building.ref,
          adress: "",
          date: "",
          architect: "",
          description: "",
          // adress: building.adresse_forme_editoriale,
          // date: building.datation_de_l_edifice,
          // architect: building.auteur_de_l_edifice,
          // description: building.description_de_l_edifice,
        });
      });

      markersArray.push(markerElement);
    }
    setMarkers(markersArray);

    // Clusterer to regroup Markers when there too many at the same place
    const renderer = {
      // @ts-ignore
      render: ({ count, position }) =>
        new google.maps.marker.AdvancedMarkerElement({
          // label: { text: String(count), color: "white", fontSize: "10px" },
          content: buildInfoTextBox(count),
          position,
          // adjust zIndex to be above other markers
          zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
        }),
    };
    const clusterer = new MarkerClusterer({ map, renderer }); //new MarkerClusterer({map, markersArray})
    clusterer.addMarkers(markersArray);

    return () => {
      markers.forEach((element) => {
        element.map = null;
      });
    };
  }, [cleanedData, isLoading]);

  function changeMarkerHighlight(
    markerElement: google.maps.marker.AdvancedMarkerElement,
    currentHighlightedMarkerElement: MutableRefObject<google.maps.marker.AdvancedMarkerElement | null>,
    setIsAdditionalInfoDisplayed: React.Dispatch<React.SetStateAction<boolean>>
  ) {
    if (currentHighlightedMarkerElement.current !== null) {
      // @ts-ignore
      currentHighlightedMarkerElement.current.content.classList.remove(
        "highlight",
        "outline",
        "outline-4",
        "outline-red-500"
      );
      // @ts-ignore
      currentHighlightedMarkerElement.current.content.style.zIndex = "auto";
    }

    if (currentHighlightedMarkerElement.current === markerElement) {
      setIsAdditionalInfoDisplayed((prev) => !prev);
      currentHighlightedMarkerElement.current = null;
    } else {
      setIsAdditionalInfoDisplayed(true);
      // @ts-ignore
      markerElement.content.classList.add(
        "highlight",
        "outline",
        "outline-4",
        "outline-amber-500"
      );
      markerElement.style.zIndex = "40";
      currentHighlightedMarkerElement.current = markerElement;
    }
  }

  //useMarker return the current selected Marker and a function to update it
  return { currentHighlightedMarkerElement, changeMarkerHighlight };
}

// @ts-ignore

// Format the results on the map
function buildInfoTextBox(number: number) {
  let count: string = "";
  if (number > 1) {
    count = number.toString();
  }
  const content = document.createElement("div");
  content.innerHTML = `
    <div class="compact bg-white shadow-md rounded-sm">
      <img src="building.svg" alt="building icon"/>
      <h3 class="text-center bold text-md ">${count}</h3>
    </div>
   `;
  return content;
}

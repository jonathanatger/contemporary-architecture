import { useEffect, useState, useRef, MutableRefObject } from "react";
import { SimplifiedBuildingInfoType } from "./buildingDatatype";
import { MarkerClusterer } from "@googlemaps/markerclusterer";

export function useMarkers(
  map: google.maps.Map | null,
  simplifiedData: SimplifiedBuildingInfoType[],
  setIsAdditionalInfoDisplayed: React.Dispatch<React.SetStateAction<boolean>>,
  setReference: React.Dispatch<React.SetStateAction<string>>,
  apiImportsLoading: boolean
) {
  const [markers, setMarkers] = useState<
    google.maps.marker.AdvancedMarkerElement[]
  >([]);
  const currentHighlightedMarkerElement =
    useRef<google.maps.marker.AdvancedMarkerElement | null>(null);

  useEffect(() => {
    if (apiImportsLoading) return;

    let markersArray = [];
    for (const building of simplifiedData) {
      if (building.coordonnees === null) continue;

      let markerElement = new google.maps.marker.AdvancedMarkerElement({
        position: {
          lat: building.coordonnees.lat,
          lng: building.coordonnees.lon,
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

        setReference(building.ref);
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

    const clusterer = new MarkerClusterer({ map, renderer });
    clusterer.addMarkers(markersArray);

    return () => {
      markers.forEach((element) => {
        element.map = null;
      });
    };
  }, [apiImportsLoading]);

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
        "outline-red-500",
        "rounded-sm"
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
        "outline-amber-500",
        "rounded-sm"
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

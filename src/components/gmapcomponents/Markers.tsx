import { useEffect, useState, useContext } from "react";
import { buildingData, BuildingInfoContextType } from "./buildingDatatype";
async function initMarker(): Promise<void> {
  // @ts-ignore
  const { AdvancedMarkerElement, PinElement } =
    (await google.maps.importLibrary("marker")) as google.maps.MarkerLibrary;
}

export function useMarkers(
  map: google.maps.Map | null,
  cleanedData: buildingData[],
  loading: boolean,
  infoDisplayed: BuildingInfoContextType,
  setInfoDisplayed: React.Dispatch<
    React.SetStateAction<BuildingInfoContextType>
  >,
  setIsAdditionalInfoDisplayed: React.Dispatch<React.SetStateAction<boolean>>
) {
  // const infoWindow = new google.maps.InfoWindow();
  const [markers, setMarkers] = useState<
    google.maps.marker.AdvancedMarkerElement[]
  >([]);

  useEffect(() => {
    initMarker();
  }, []);

  useEffect(() => {
    console.log("use markers useEffect");
    if (!cleanedData || loading) return;

    let markersArray = [];
    for (const building of cleanedData) {
      if (building.coordonnees === null) continue;

      let markerElement = new google.maps.marker.AdvancedMarkerElement({
        position: {
          lat: building.coordonnees.lat,
          lng: building.coordonnees.lon,
        },
        map: map,
        content: buildInfoTextBox(
          building.titre_courant,
          building.adresse_forme_editoriale,
          building.auteur_de_l_edifice,
          building.description_de_l_edifice
        ),
      });

      markerElement.addListener("click", () => {
        toggleMarkerHighlight(markerElement);
        setIsAdditionalInfoDisplayed(true);
        setInfoDisplayed({
          titre: building.titre_courant,
          adress: building.adresse_forme_editoriale,
          date: building.datation_de_l_edifice,
          architect: building.auteur_de_l_edifice,
          description: building.description_de_l_edifice,
        });
      });

      markersArray.push(markerElement);
    }
    setMarkers(markersArray);

    return () => {
      markers.forEach((element) => {
        element.map = null;
      });
      setMarkers([]);
    };
  }, [cleanedData]);
}

// @ts-ignore
function toggleMarkerHighlight(markerElement) {
  if (markerElement.content.classList.contains("highlight")) {
    markerElement.content.classList.remove("highlight");
    markerElement.content.classList.add("compacted");
  } else {
    markerElement.content.classList.remove("compacted");
    markerElement.content.classList.add("highlight");
  }
}

// Format the results on the map
function buildInfoTextBox(
  title: string,
  adresse: string,
  architecte: string,
  description?: string
) {
  const content = document.createElement("div");
  content.classList.add("compacted");
  content.innerHTML = `
    <div class="compact bg-white shadow-md rounded-sm">
      <img src="building.svg" alt="building icon"/>
    </div>
    <div class="full text-white bg-slate-400 p-2 max-w-64 rounded-md marker-font">
      <h1>${title}</h1>
      <h2 class="italic">Architecte : ${architecte}</h2>
      <h2 class="italic">Adresse : ${adresse}</h2>
      <br/>
      <h3 class="truncate">${description}<h3/>
    </div>
   `;
  return content;
}

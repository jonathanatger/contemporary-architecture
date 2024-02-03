import { useEffect, useState, useContext } from "react";
import { buildingData } from "./buildingDatatype";
async function initMarker(): Promise<void> {
  // @ts-ignore
  const { AdvancedMarkerElement, PinElement } =
    (await google.maps.importLibrary("marker")) as google.maps.MarkerLibrary;
}

//Defining the information displayed when an address gets selected
interface BuildingInfoContextType {
  display: boolean;
  name: string;
}

export function useMarkers(
  map: google.maps.Map | null,
  data: buildingData[] | null,
  loading: boolean,
  infoDisplayed: BuildingInfoContextType,
  setInfoDisplayed: React.Dispatch<
    React.SetStateAction<BuildingInfoContextType>
  >
) {
  // const infoWindow = new google.maps.InfoWindow();
  const [markers, setMarkers] = useState<
    google.maps.marker.AdvancedMarkerElement[]
  >([]);

  useEffect(() => {
    initMarker();
  }, []);

  useEffect(() => {
    if (markers.length !== 0) {
      markers.forEach((element) => {
        element.map = null;
      });
      setMarkers([]);
    }

    if (data && !loading) {
      let markersArray = [];
      for (const building of data) {
        let markerElement = new google.maps.marker.AdvancedMarkerElement({
          position: {
            lat: building.coordonnees_geographiques_d_un_point_coor_lon_lat_coor
              .lat,
            lng: building.coordonnees_geographiques_d_un_point_coor_lon_lat_coor
              .lon,
          },
          map: map,
          content: buildInfoTextBox(
            building.titre_courant_tico,
            building.adresse_affichage_wadrs,
            building.auteurs_pour_pop_autr,
            building.commentaire_descriptif_de_l_edifice_desc_pas_plus_de_8000_signes
          ),
        });

        markerElement.addListener("click", () => {
          toggleMarkerHighlight(markerElement);
          setInfoDisplayed({
            display: true,
            name: building.titre_courant_tico,
          });
        });

        markersArray.push(markerElement);
      }
      setMarkers(markersArray);
    }

    return () => {
      markers.forEach((element) => {
        element.map = null;
      });

      setMarkers([]);
    };
  }, [data]);
}

// @ts-ignore
function toggleMarkerHighlight(markerElement) {
  if (markerElement.content.classList.contains("highlight")) {
    markerElement.content.classList.remove("highlight");
    markerElement.content.classList.add("compacted");
  } else {
    markerElement.content.classList.remove("compacted");
    markerElement.content.classList.add("highlight");
    markerElement.zIndex = 1;
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
    <div class="compact bg-red-400">
      <h1>This a secondary div</h1>
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

/*
function aslsdfsdf(){
  return (
    <div>
      <h1>${title}</h1>
    </div>
  )
}
*/

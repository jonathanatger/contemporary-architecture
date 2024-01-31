import { useEffect, useState } from "react";
import { buildingData } from "./buildingDatatype";

export function useMarkers(
  map: google.maps.Map | null,
  data: buildingData[] | null,
  loading: boolean
) {
  //   const infoWindow = new google.maps.InfoWindow();
  const [markers, setMarkers] = useState<
    null | google.maps.marker.AdvancedMarkerElement[]
  >(null);

  useEffect(() => {
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
          content: buildInfoTextBox(building.titre_courant_tico),
        });

        markerElement.addListener("click", () => {
          //   infoWindow.close();
          //   infoWindow.setContent(markerElement.getTitle());
          //   infoWindow.open(marker.getMap(), markerElement);
        });

        markersArray.push(markerElement);
      }

      setMarkers(markersArray);
    }
  }, [data]);

  useEffect(() => {
    markers?.forEach((markerElement) => {
      //   markerElement.setMap(map);
    });
  }, [map, markers]);
}

// Format the results on the map
function buildInfoTextBox(title: string) {
  const content = document.createElement("div");
  content.classList.add("h-32 w-32 bg-green-300");
  content.innerHTML = title;
  return content;
}

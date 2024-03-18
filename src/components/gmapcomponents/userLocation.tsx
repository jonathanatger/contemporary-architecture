import { useEffect } from "react";

export function useUserLocation(
  map: google.maps.Map | null,
  apiImportsAreLoading: boolean
) {
  useEffect(() => {
    if (apiImportsAreLoading) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          new google.maps.marker.AdvancedMarkerElement({
            position: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
            map: map,
            content: userLocationBox(),
            zIndex: 199999999,
          });
        }
      );
    }
  }, [apiImportsAreLoading]);
}

// Format the results on the map
function userLocationBox() {
  const content = document.createElement("div");
  content.innerHTML = `
    <div class="compact flex flex-col items-center  ">
      <div class="animate-pulse" style="width: 0; 
        height: 0; 
        border-left: 15px solid transparent;
        border-right: 15px solid transparent;
        border-top: 15px solid rgb(180, 83, 9)"/>

    </div>
   `;

  content.style.zIndex = "999";
  return content;
}

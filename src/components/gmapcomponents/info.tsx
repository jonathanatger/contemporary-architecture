import { MutableRefObject } from "react";
import { BuildingInfoType } from "./buildingDatatype";

export function Info({
  info,
  setAdditionalInfoDisplayed,
  currentHighlightedMarkerElement,
  changeMarkerHighlight,
  loading,
}: {
  info: BuildingInfoType | null;
  setAdditionalInfoDisplayed: React.Dispatch<React.SetStateAction<boolean>>;
  currentHighlightedMarkerElement: MutableRefObject<google.maps.marker.AdvancedMarkerElement | null>;
  changeMarkerHighlight: Function;
  loading: boolean;
}) {
  function handleClick() {
    changeMarkerHighlight(
      currentHighlightedMarkerElement.current,
      currentHighlightedMarkerElement,
      setAdditionalInfoDisplayed
    );
  }

  return (
    <div className="h-1/4 ml-4 mb-8 mr-16 w-[80vw] fixed bottom-0 pointer-events-none right-0">
      <button
        onClick={handleClick}
        className="absolute top-0 -right-14 w-12 bg-white z-40 overflow-auto rounded-md text-xl font-bold pointer-events-auto shadow-xl">
        X
      </button>
      {/* <LoadingElement /> */}
      {loading ? <LoadingElement /> : <InfoElement info={info} />}
    </div>
  );
}

const LoadingElement = function () {
  return (
    <div className="bg-white h-full w-full p-2 shadow-lg rounded-md  overflow-y-auto pointer-events-auto">
      <div className="animate-pulse min-w-64">
        <div className="bg-slate-100 text-center rounded-md min-h-8 mb-4 max-w-48"></div>
        <div className="bg-slate-100 text-center rounded-md min-h-8 mb-4 max-w-36"></div>
        <div className="bg-slate-100 text-center min-h-48  rounded-md"></div>
      </div>
    </div>
  );
};

const InfoElement = function ({ info }: { info: BuildingInfoType | null }) {
  return (
    <div className="bg-white h-full w-full p-2 shadow-lg rounded-md  overflow-y-auto pointer-events-auto">
      <h2 className="pb-2">{info?.titre}</h2>
      <h3 className="pb-2 italic text-sm">Auteur(s) : {info?.auteur}</h3>
      <h2 className="pb-2 italic text-sm">Datation : {info?.date}</h2>
      <h3 className="text-sm">{info?.description}</h3>
    </div>
  );
};

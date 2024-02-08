import { BuildingInfoContextType } from "./buildingDatatype";

export function Info({
  info,
  setAdditionalInfoDisplayed,
}: {
  info: BuildingInfoContextType;
  setAdditionalInfoDisplayed: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  function handleClick() {
    setAdditionalInfoDisplayed(false);
  }

  return (
    <div className="h-1/4 ml-4 mb-8 mr-16 fixed  bottom-0 pointer-events-none">
      <button
        onClick={handleClick}
        className="absolute top-0 -right-14 w-12 bg-white z-40 overflow-auto rounded-md text-xl font-bold pointer-events-auto shadow-lg">
        X
      </button>
      <div className="bg-white h-full p-2  shadow-lg rounded-md  overflow-y-auto pointer-events-auto">
        <h2 className="pb-2">{info.titre}</h2>
        <h3 className="pb-2 italic text-sm">Auteur(s) : {info.architect}</h3>
        <h2 className="pb-2 italic text-sm">Datation : {info.date}</h2>
        <h3 className="text-sm">{info.description}</h3>
      </div>
    </div>
  );
}

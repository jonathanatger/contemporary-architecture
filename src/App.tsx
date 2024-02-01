import { WebsiteTitle } from "./components/WebsiteTitle";
import { Filters } from "./components/Filters";
import { GoogleMap } from "./components/GMap";
import { useState, useContext, createContext } from "react";
import { Info } from "./components/gmapcomponents/info";

//Defining the information displayed when an address gets selected
interface BuildingInfoContextType {
  display: boolean;
  name: string;
}

//Extending former Interface to include the function that will allow it to update the information
interface InfoContextInterface extends BuildingInfoContextType {
  setInfoContext: Function;
}

// Iniating React Context
export const InfoContext = createContext<InfoContextInterface>({
  display: false,
  name: "",
  setInfoContext: () => {},
});

function App() {
  const info = useContext(InfoContext);
  const [infoDisplayed, setInfoDisplayed] = useState<BuildingInfoContextType>({
    display: false,
    name: "",
  });

  return (
    <InfoContext.Provider
      value={{
        display: infoDisplayed.display,
        name: infoDisplayed.name,
        setInfoContext: setInfoDisplayed,
      }}>
      <div className="flex flex-col items-center bg-slate-800 h-svh w-svw">
        <div className="bg-blue-300 h-32 w-full">
          <WebsiteTitle
            title="Archimap"
            subtitle="L'architecture contemporaine listée, près de chez vous"
            disabled={false}
          />
        </div>
        <div className="flex justify-center bg-red-300 h-16 w-full">
          <Filters />
        </div>
        <div className="flex bg-violet-300 basis-auto grow w-full justify-center">
          <GoogleMap />
          {infoDisplayed.display && <Info />}
        </div>
      </div>
    </InfoContext.Provider>
  );
}

export default App;

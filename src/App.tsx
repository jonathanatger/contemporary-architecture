import React from "react";
import { WebsiteTitle } from "./components/WebsiteTitle";
import { Filters } from "./components/Filters";
import { Map } from "./components/Map";

function App() {
  return (
    <>
      <div className="flex flex-col items-center  bg-slate-800 h-svh w-svw">
        <div className="bg-blue-300 h-32 container">
          <WebsiteTitle
            title="Archimap"
            subtitle="L'architecture contemporaine listée, près de chez vous"
            disabled={false}
          />
        </div>
        <div className="flex justify-center bg-red-300 h-32 container">
          <Filters />
        </div>
        <div className="flex bg-violet-300 min-h-min container justify-center">
          <Map />
        </div>
      </div>
    </>
  );
}

export default App;

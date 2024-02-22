import { GoogleMap } from "./components/GMap";
import React, { useState, createContext } from "react";

interface ContextInterface {
  dispatch: React.Dispatch<React.SetStateAction<boolean>> | null;
  visible: boolean;
}
// Context necessary to pass down function to children of Google maps
// component
export const menuVisibleContext = createContext<ContextInterface>({
  dispatch: null,
  visible: true,
});

function App() {
  const [menuIsVisible, setMenuIsVisible] = useState<boolean>(true);
  return (
    <menuVisibleContext.Provider
      value={{ dispatch: setMenuIsVisible, visible: menuIsVisible }}>
      <div className="bg-slate-800 h-svh w-svw">
        {menuIsVisible && (
          <div className="flex flex-row justify-center items-center w-full  absolute left-0 top-0 z-30 pointer-events-none">
            <div className="flex flex-col grow my-4 mx-4 max-w-screen-md justify-center bg-white h-24 items-center shadow-lg rounded-md">
              <h1 className="text-3xl text-amber-600 pb-2 font-sixtyfour ">
                ArchiMap
              </h1>
              <h2 className="text-amber-600 text-sm px-2 text-center font-josefin text-balance">
                Édifices labellisés « Architecture contemporaine remarquable »
              </h2>
            </div>
          </div>
        )}
        <div className="flex bg-slate-800  h-full w-full justify-center">
          <GoogleMap />
        </div>
      </div>
    </menuVisibleContext.Provider>
  );
}

export default App;

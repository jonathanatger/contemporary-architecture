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
      <main className="bg-amber-100 h-svh w-svw">
        {menuIsVisible && (
          <div className="flex flex-row justify-center items-center w-full absolute left-0 top-0 z-30 pointer-events-none">
            <div className="flex flex-col max-w-screen-md grow my-4 mx-4 justify-center bg-white h-24 items-center shadow-lg rounded-md">
              <h1 className="text-3xl text-amber-600 pb-2 font-sixtyfour ">
                ArchiMap
              </h1>
              <h2 className="text-amber-600 text-sm px-2 text-center font-josefin text-balance">
                Édifices labellisés « Architecture contemporaine remarquable »
              </h2>
            </div>
          </div>
        )}
        <section
          className="flex h-full w-full justify-center items-center"
          role="application">
          <div
            role="status"
            className="flex flex-col absolute justify-center items-center bg-white space-around h-32 w-128 rounded-md p-6 shadow-md">
            <h2 className="pb-6 text-amber-600"> Chargement de la carte...</h2>
            <div role="status">
              <svg
                aria-hidden="true"
                className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-yellow-400"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            </div>
          </div>
          <GoogleMap />
        </section>
      </main>
    </menuVisibleContext.Provider>
  );
}

export default App;

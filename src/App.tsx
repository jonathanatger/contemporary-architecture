import { WebsiteTitle } from "./components/WebsiteTitle";
import { Filters } from "./components/Filters";
import { GoogleMap } from "./components/GMap";

function App() {
  return (
    <>
      <div className="flex flex-col items-center bg-slate-800 h-svh w-svw">
        <div className="bg-blue-300 h-32 w-full">
          <WebsiteTitle
            title="Archimap"
            subtitle="L'architecture contemporaine listée, près de chez vous"
            disabled={false}
          />
        </div>
        <div className="flex justify-center bg-red-300 h-32 w-full">
          <Filters />
        </div>
        <div className="flex bg-violet-300 basis-auto grow w-full justify-center">
          <GoogleMap />
        </div>
      </div>
    </>
  );
}

export default App;

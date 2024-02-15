import { GoogleMap } from "./components/GMap";

function App() {
  return (
    <div className="bg-slate-800 h-svh w-svw">
      <div className="bg-blue-300 h-32 m-2 w-[5/6] absolute right-0 top-0 z-30 rounded-sm">
        <div className="flex flex-col w-full h-32 justify-center items-center">
          <h1 className="text-3xl text-red-600">ArchiMap</h1>
          <h2 className="text-red-600 text-sm px-4 text-center">
            L'architecture contemporaine listée, près de chez vous
          </h2>
        </div>
      </div>
      <div className="flex bg-violet-300  h-full w-full justify-center">
        <GoogleMap />
      </div>
    </div>
  );
}

export default App;

import { useContext } from "react";
import { InfoContext } from "../../App";

export function Info() {
  const info = useContext(InfoContext);
  const name = info ? info.name : "";

  return (
    <div className="w-32 h-32 fixed bottom-0 bg-white text-red-800">{name}</div>
  );
}

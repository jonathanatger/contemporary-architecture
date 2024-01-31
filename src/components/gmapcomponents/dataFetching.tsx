//useFetch.js
import { useState, useEffect } from "react";
import { buildingData } from "./buildingDatatype";

export function useFetch(url: string) {
  const [data, setData] = useState<null | buildingData[]>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    setLoading(true);
    setData(null);
    setError(null);
    fetch(url)
      .then((res) => {
        setLoading(false);

        // @ts-ignore
        return res.json();
      })
      .then((response) => {
        setData(response.results as buildingData[]);
      })
      .catch((err) => {
        setLoading(false);
        setError("Error in the data fetching to the source data.gouv.fr");
        console.log(err);
      });
  }, [url]);

  return { data, loading, error };
}

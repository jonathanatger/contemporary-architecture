//useFetch.js
import { useState, useEffect } from "react";
import { buildingData } from "./buildingDatatype";

export function useFetch() {
  const [url, setUrl] = useState<string>(
    "https://data.culture.gouv.fr/api/explore/v2.1/catalog/datasets/liste-des-edifices-labellises-architecture-contemporaine-remarquable-acr/records?where=auteurs_pour_pop_autr%3D%22Pinsard%20Pierre%20(architecte)%22&limit=20"
  );
  const [data, setData] = useState<null | buildingData[]>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    setLoading(true);
    setData(null);
    setError(null);
    const _headers = new Headers({});
    fetch(url, {
      headers: _headers,
    })
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
        setError(
          "Error in the data fetching to the source data.gouv.fr : " + err
        );
        console.log(err);
      });
  }, [url]);

  return { data, loading, error };
}

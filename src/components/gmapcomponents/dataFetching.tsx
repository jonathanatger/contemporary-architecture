//useFetch.js
import { useState, useEffect } from "react";
import { buildingData } from "./buildingDatatype";

export function useFetch() {
  const [url, setUrl] = useState<string>(
    "https://data.culture.gouv.fr/api/explore/v2.1/catalog/datasets/liste-des-edifices-labellises-architecture-contemporaine-remarquable-acr/records?limit=100"
  );
  const [data, setData] = useState<buildingData[]>([] as buildingData[]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    setLoading(true);
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
        setData(cleanGovernmentData(response.results));
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

export function cleanGovernmentData(
  data: buildingData[] | null | undefined
): buildingData[] {
  let cleanedData = [] as buildingData[];

  data?.forEach((building) => {
    let titre = building.titre_courant
      ? building.titre_courant
          .toLocaleUpperCase()
          // Replace opening and closing quotes
          .replace(/^"(.+(?="$))"$/, "$1")
      : "Pas de titre donné à la réalisation.";

    let auteur = building.auteur_de_l_edifice
      ? building.auteur_de_l_edifice
      : "Pas d'auteur attribué.";

    let datation = building.datation_de_l_edifice
      ? building.datation_de_l_edifice
      : "Pas de dates données à la réalisation";

    let description = building.description_de_l_edifice
      ? building.description_de_l_edifice
      : "Pas de description disponible.";

    let adresse = building.adresse_forme_editoriale
      ? building.adresse_forme_editoriale
      : "-";

    cleanedData.push({
      adresse_forme_editoriale: adresse,
      coordonnees: building.coordonnees ? building.coordonnees : null,
      titre_courant: titre,
      auteur_de_l_edifice: auteur,
      datation_de_l_edifice: datation,
      description_de_l_edifice: description,
    });
  });

  return cleanedData;
}

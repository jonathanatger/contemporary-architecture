import { useEffect } from "react";
import { BuildingData, BuildingInfoType } from "./buildingDatatype";

export function useFetch(
  reference: string,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setAdditionalInfoDisplayed: React.Dispatch<
    React.SetStateAction<BuildingInfoType | null>
  >
) {
  const url = `https://data.culture.gouv.fr/api/explore/v2.1/catalog/datasets/liste-des-edifices-labellises-architecture-contemporaine-remarquable-acr/records?where=reference_de_la_notice%20%3D%20%22${reference}%22&limit=1`;

  useEffect(() => {
    if (reference === "") return;
    setLoading(true);
    setError(null);

    const _headers = new Headers({});

    fetch(url, {
      headers: _headers,
    })
      .then((res) => {
        // @ts-ignore
        return res.json();
      })
      .then((response) => {
        setAdditionalInfoDisplayed(cleanGovernmentData(response.results));
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(
          "Error in the data fetching to the source data.gouv.fr / " + err
        );
      });
  }, [reference]);
}

function cleanGovernmentData(
  data: BuildingData[] | null | undefined
): BuildingInfoType | null {
  if (data === null || data === undefined) return null;

  let building = data[0];

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

  let description_historique = building.description_historique
    ? building.description_historique
    : "Pas de description historique disponible.";

  let adresse = building.adresse_forme_editoriale
    ? building.adresse_forme_editoriale
    : "Pas d'adresse disponible.";

  let cleanedData: BuildingInfoType = {
    adresse: adresse,
    coordonnees: building.coordonnees ? building.coordonnees : null,
    titre: titre,
    auteur: auteur,
    date: datation,
    description: description,
    description_historique: description_historique,
  };

  return cleanedData;
}

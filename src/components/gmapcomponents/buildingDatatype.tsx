export interface buildingData extends buildingKnownData {}

interface buildingKnownData {
  adresse_forme_editoriale: string;
  coordonnees: {
    lon: number;
    lat: number;
  } | null;
  titre_courant: string;
  datation_de_l_edifice: string;
  description_de_l_edifice: string;
  auteur_de_l_edifice: string;
}

//Defining the information displayed when an address gets selected
export interface BuildingInfoContextType {
  titre: string;
  adress: string;
  date: string;
  architect: string;
  description: string;
}
// interface buildingAdditionalData extends buildingKnownData {
//   [key: string]: string;
// };

//Previous queries had those datapoints
/*
export type buildingData = buildingKnownData & buildingAdditionalData;

export type buildingKnownData = {
  adresse_affichage_wadrs: string;
  coordonnees: {
    lon: number;
    lat: number;
  };
  titre_courant_tico: string;
  dates_de_construction_pour_pop_debut_fin_date?: string;
  commentaire_descriptif_de_l_edifice_desc_pas_plus_de_8000_signes?: string;
  auteurs_pour_pop_autr: string;
};

type buildingAdditionalData = {
  [key: string]: string;
};
*/

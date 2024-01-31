export type buildingData = buildingKnownData & buildingAdditionalData;

export type buildingKnownData = {
  adresse_affichage_wadrs: string;
  coordonnees_geographiques_d_un_point_coor_lon_lat_coor: {
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

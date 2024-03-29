# ArchiMap

[Aller sur le site ici](https://archimap.jonathanatger.com)


[![My Skills](https://skillicons.dev/icons?i=ts,vite,tailwind,react)](https://skillicons.dev)

## Pourquoi ArchiMap ?

Lors d'un déplacement, la première chose sur laquelle un architecte va se renseigner est la présence de bâtiments remarquables à visiter. ArchiMap rend la recherche de bâtiments remarquables simple et rapide, en présentant de manière visuelle les emplacements et les informations des architectures contemporaines classées.

<img width="819" alt="ArchiMapMain" src="https://github.com/jonathanatger/contemporary-architecture/assets/50679537/e7479a9e-d9b3-4605-baac-c7328a5eefa2">

## Comment ?

Le site se base sur l'API de Google Maps pour créer un plan interactif et l'API du gouvernement français pour les informations à afficher. L'interface est simple et se consacre à l'essentiel.

### Technologies employées

- React
- Vite
- Tailwind
- Typescript
- Bun

React, Vite, Bun et Tailwind sont des bons choix pour un projet d'une page interactive et avec un backend très limité. Typescript est pensé pour faciliter la gestion des types de données issus des API.

En ce qui concerne l'API Google Maps : L'objet `Map` pour la carte, `places.AutocompleteService` pour la recherche de localités, Map Styles pour garder la carte épurée et ne pas afficher d'objets parasites, `marker.AdvancedMarkerElement` pour la création de marqueurs personnalisés sur la carte, `MarkerClusterer` pour la gestion du regroupement des marqueurs selon le niveau de zoom.

Ont été également mis au point une gestion du zoom progressif quand c'est possible, des éléments graphiques de remplacement durant les chargements (l'API de Google Maps demande des chargement de bibliothèque dynamiques), la gestion du passage à Street View.

### Note sur la clef API Google Maps

Celle-ci doit être accessible depuis le client pour faire des requêtes, et ne peux donc pas être cachées en tant que variable d'environnement. Les requêtes utilisant cette clef sont configurées pour venir d'un domaine précis et sont capées; en cas d'activité trop forte la clef sera rendue inutilisable.


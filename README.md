# Projet Intégration de Données Connectées

Ce projet est une application web Node.js qui récupère et affiche des données d'EDF (avec une carte) et d'Enedis (avec un histogramme). Il utilise une architecture MVC (Modèle-Vue-Contrôleur).

# Table des matières

1. [Projet Intégration de Données Connectées](#projet-intégration-de-données-connectées)
2. [Sources des Données](#sources-des-données)
3. [Documentation API avec Swagger](#documentation-api-avec-swagger)
4. [Prérequis](#prérequis)
   - [Installation](#installation)
   - [Installation des dépendances](#installation-des-dépendances)
   - [Lancer le projet](#lancer-le-projet)
5. [Fonctionnalités de l'API et du site web](#fonctionnalités-de-l-'-api-et-du-site-web)

## Sources des Données

Notre projet utilise des données provenant de deux API pour réaliser l'intégration et l'analyse des données :

- **Enedis DataHub API**: [API Enedis DataHub](https://data.enedis.fr/api/explore/v2.1/console).
- **EDF Open Data API**: [API Open Data EDF](https://opendata.edf.fr/api/v1/console/datasets/1.0/search/).

## Documentation API avec Swagger

Pour faciliter l'utilisation et la compréhension de notre API, nous avons mis en place une documentation interactive avec Swagger. Bien que nous soyons encore en phase de développement, cette documentation Swagger offrira un aperçu complet des points de terminaison de l'API, des paramètres requis et des formats de réponse. Cela permettra aux utilisateurs et aux développeurs d'interagir facilement avec notre API une fois qu'elle sera disponible.

## Prérequis

Ce projet est basé sur Node.js. Assurez-vous d'avoir Node.js et npm (qui est inclus avec Node.js) installés sur votre machine.

### Installation

Clonez le repo et installez les dépendances :
git clone https://github.com/Axel667/integration_projet.git

### Installation des dépendances

Installez les dépendances du projet avec la commande :
npm install

### Lancer le projet
Pour lancer le projet, utilisez la commande :
node src/index.js

Cela démarrera le serveur de développement. Vous pouvez maintenant ouvrir http://localhost:3000 sur votre naviguateur pour voir le projet. Notre projet ne dispose pas de clés d'API.

## Fonctionnalités de l'API et du site web
- **Récupération des données Enedis et EDF**: L'API récupère les données d'Enedis et d'EDF à partir de leurs API respectives. Ces données sont ensuite utilisées pour alimenter les visualisations sur le site web. Les fonctions responsables de cette récupération sont getEnedisData dans src/services/enedisServices.js et getEdfData dans src/services/edfServices.js.
- **Affichage des données Enedis et EDF**: Le site web affiche les données récupérées sous forme de visualisations. Il y a deux types de visualisations : une carte pour les données EDF et un histogramme pour les données Enedis. Les fonctions responsables de ces visualisations sont fetchAndDisplayEdfMap et initializeHistogram dans public/js/main.js.
- **Gestion des événements**: Le site web a des liens qui, lorsqu'ils sont cliqués, déclenchent le chargement et l'affichage des données EDF ou Enedis. Les gestionnaires d'événements pour ces liens sont définis dans public/js/main.js.
- **Gestion des erreurs**: L'API et le site web ont une gestion des erreurs intégrée. Par exemple, si une erreur se produit lors de la récupération des données Enedis ou EDF, un message d'erreur est affiché à l'utilisateur.

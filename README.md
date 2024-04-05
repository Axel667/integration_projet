# Projet Intégration de Données Connectées

Ce projet est une application web Node.js qui récupère et affiche des données d'EDF (avec une carte) et d'Enedis (avec un histogramme). Il utilise une architecture MVC (Modèle-Vue-Contrôleur).

## Table des Matières

- [À Propos](#à-propos)
- [Commencer](#commencer)
- [Usage](#usage)
- [Contribution](#contribution)
- [Licence](#licence)
- [Contact](#contact)

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

installez les dépendances du projet avec la commande :
npm install

### Lancer le projet
Pour lancer le projet, utilisez la commande :
npm run dev

Cela démarrera le serveur de développement. Vous pouvez maintenant ouvrir votre navigateur et naviguer vers http://localhost:3000 pour voir le projet.

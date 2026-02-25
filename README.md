# Adum-Catalog-Extension
Ajoute une section au catalogue avec les liens des formations ajoutées depuis la dernière visite.

## Mozilla
### Install webext
Voir https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/

### Build
Créer le manifeste de Mozilla à la racine:
```
cp manifests/manifest-mozilla.json manifest.json
```

Puis toujours à la racine:
```
web-ext build
```

Le .zip doit être créé dans `/web-ext-artifacts`

### Ajouter dans Firefox
Voir *about:addons* et https://addons.mozilla.org
**(ou demander le .xpi, à installer depuis les fichiers dans *about:addons*)**

## Chromium (Chrome, Edge, Brave...)
Créer le manifeste de Chromium à la racine:
```
cp manifests/manifest-chromium.json manifest.json
```

Puis ajouter le dossier entier dans le navigateur Chromium **(en mode développeur)**

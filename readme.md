
## Plan d'éxecution

### Construction de la liste complète des paires disponibles sur Binance

Ce script doit être exécuté avant le script principal pour être sûr d'inclure les nouvelles paires dans le processus.

```
ts-node src/build-pairs-list
```

### Execution du script principal

```
ts-node src/Ailurophilium
```
*(les variables d'entrées peuvent être ajustées dans le fichier `src/Ailurophilium.ts`)*

Le script a pour effet d'appeler toutes les exécutions séquentiellement :
- construction de la liste des paires candidates.
- construction de la liste de données pour chaque paire (`PairsKlines`) :
  - requêtes vers Binance (création du nouveau fichier de données ou mise à jour du fichier en ajoutant les jours manquants)
- création du tableau de classement des paires (avec le volume)
- filtrage du `PairsKlines` global pour construire un `PairsKlines` qui ne contient que les paires du classement
- conversion du `PairsKlines` vers la structure de données finale (`AilurophiliumBlock`) avant la migration :
  - calcul des deux variables maximales (montée: `100(H - O)/O`; descente: `100(O - B)/O`)
  - migration des données vers l'`AilurophiliumBlock`
- migration finale de l'`AilurophiliumBlock` vers le fichier Excel.
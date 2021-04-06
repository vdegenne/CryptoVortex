
<p>
  <img src="./images/final3.png" width="280px" />
</p>


## Plan d'éxecution (order matters)

Pour chaque fonction voir les options disponibles avec `--help`

**1. Construction de la liste complète des paires disponibles sur Binance**

```
./src/vortex.ts binance-pairs
```

**2. Appels et sauvegarde des informations de paires depuis Binance**

```
./src/vortex.ts binance
```

**3. Construction du fichier dump**

```
./src/vortex.ts dump
```

**Execution du script principal (to update !)**

```
ts-node src/CryptoVortex
```
*(les variables d'entrées peuvent être ajustées dans le fichier `src/CryptoVortex.ts`)*

### détails

Le script a pour effet d'appeler toutes les exécutions séquentiellement :

- construction de la liste des paires candidates.
- construction de la liste de données pour chaque paire (`PairsKlines`) :
  - requêtes vers Binance (création du nouveau fichier de données ou mise à jour du fichier en ajoutant les jours manquants.)
- création du tableau de classement des paires (avec le volume.)
- filtrage du `PairsKlines` global pour construire un `PairsKlines` qui ne contient que les paires du classement.
- conversion du `PairsKlines` vers la structure de données finale (`AilurophiliumBlock`) avant la migration :
  - calcul des deux variables maximales (montée: `100(H - O)/O`; descente: `100(O - B)/O`).
  - migration des données vers l'`AilurophiliumBlock`.
- migration finale de l'`AilurophiliumBlock` vers le fichier Excel.

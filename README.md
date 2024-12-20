# Commande Linux sur Windows

Un projet permettant de créer des alias de commandes Windows pour utiliser une syntaxe similaire à celle des commandes Linux.

## Présentation
Ce projet vise à rendre l'expérience en ligne de commande sous Windows plus intuitive pour les utilisateurs habitués aux commandes Linux. Il permet de créer facilement des alias qui mappent des commandes Windows à des commandes Linux équivalentes.

### Exemple
- `ls` → `dir /B %1`
- `cat` → `type %1`
- `touch` → `echo. > %1`
- `rm` → `del %1`
- `clear` → `cls`

## Installation

1. Clonez ce dépôt :
   ```bash
   git clone https://github.com/utilisateur/commande-linux-windows.git
   ```

2. Exécuter le script python :
 ```bash
   pip install psutil flask
   python3 main.py
   ```

## Utilisation

Une fois configuré :
- Ouvrez votre terminal (CMD ou PowerShell).
- Utilisez les commandes Linux comme vous le feriez sur une distribution Linux !

### Exemple d'exécution
```bash
C:\> ls
 Volume in drive C has no label.
 Directory of C:\

12/20/2024  10:00 AM    <DIR>          Program Files
12/20/2024  10:00 AM    <DIR>          Users
12/20/2024  10:00 AM    <DIR>          Windows
```

## Contributions

Les contributions sont les bienvenues !
- **Rapport de bugs** : Veuillez ouvrir une issue sur le dépôt GitHub.
- **Demandes de fonctionnalités** : Soumettez une pull request avec une description claire de la fonctionnalité.


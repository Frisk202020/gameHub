# Welcome to Game Hub ! 

This project is a collection of games available to play on a web browser. The user needs to launch a web [server](server/) that gives access to the games on his computer and others on the same local network (HTTP connection).

Currently, games are playable only on a single computer, but future versions should make these available for proper local multiplayer, then online multiplayer.

## Tools required to contribute

- A rust compiler to work on the web server.
- A typescript compiler to work on _Celestopia_ and the _logs_ page of the server.

## Available games

- naval/ is an online battleship game.
- celestopia/ is a board game inspired by the game series _Mario Party_ and the board game _Pay Day_.

## How to play

The easiest way is to download the *release* package. You can also download the source code and compile everything using the tools listed before.

## About game's development

These games were developped as I was learning (on my own) web development. As such, the creation process and quality of each entry varies. Here's a timeline of each game's development process :

- lost-in-the-void : finished in december 2024 (first real js project), took ~1 month
- naval : february 2025, took ~1 week
- celestopia : september 2025 (discovered typescript, largest project so far), took ~2 months and updates to make it online are still planned

The server was built with celestopia, then other projects were appended to it. Server's Log API was developped in a few days before the first release.

## How to contribute

If you want to contribute, please make a seperate branch and create an issue explaining the purpose of your contribution. In any case, any merge request to a branch owned by myself will be reveiwed first.
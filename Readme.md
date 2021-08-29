![Meme Kombat Logo](https://memekombat.rchaves.app/img/logo.png)

Meme Kombat
=====================================

This is the repository for the game [Meme Kombat](https://memekombat.rchaves.app/), which was very popular on facebook around 2012, when memes like Trollface, Fuck Yeah, Forever Alone and others were all over the internet. I've open-sourced it in 2021, with the goal to get it working again decoupled from facebook, but changing as little as possible to keep the original work living on forever.

Needless to say my code from 2012 was horrible, I think there is some beauty in keeping it that way, but that also means that if you want make any contributions it will require some extra effort, so good luck. I'll do my best to review any pull requests.

Run locally
-----------

Install dependencies:

    npm install

Launch the app:

    node web.js

Deploy:

    eval $(docker-machine env your-platform)
    docker-compose -f docker-compose.prod.yml up -d --build
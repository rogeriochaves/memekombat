Meme Kombat
=====================================

Run locally
-----------

Install dependencies:

    npm install

Launch the app:

    node web.js

Deploy:

    eval $(docker-machine env your-platform)
    docker-compose -f docker-compose.prod.yml up -d --build
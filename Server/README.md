# Neurone Store Backend

The purpose of this pyoecto is to build a server, based on express.js, for the correct operation of the Neurone Store module. Listening to all customer requests and returning necessary data from the database.

## Development

You need to install MongoDB into your local environment and have a collection named `test`. You can follow de official instructions to have mongodb. https://www.mongodb.com/download-center.

Run `npm start` for a dev server. If you want to refresh automatically to your changes please run `npm i nodemon`, then run `nodemon start`.

Also you can modify the configuration of the database in the `.env` file.

## Docker

Please to run the next commands you need to install Docker. https://docs.docker.com/install/

Run `bash build.sh` and `bash run.sh` to deploy in a docker instance this project.

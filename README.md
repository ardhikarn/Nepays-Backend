<h1 align="center">ExpressJS - Nepays RESTfull API</h1>

## Built With

[![Express.js](https://img.shields.io/badge/Express.js-4.x-orange.svg?style=rounded-square)](https://expressjs.com/en/starter/installing.html)
[![Node.js](https://img.shields.io/badge/Node.js-v.12.13-green.svg?style=rounded-square)](https://nodejs.org/)

## Requirements

1. <a href="https://nodejs.org/en/download/">Node Js</a>
2. Node_modules
3. <a href="https://www.getpostman.com/">Postman</a>
4. Web Server (ex. localhost)

## How to run the app ?

1. Open app's directory in CMD or Terminal
2. Type `npm install`
3. Make new file a called **.env**, set up first [here](#set-up-env-file)
4. Turn on Web Server and MySQL can using Third-party tool like xampp, etc.
5. Create a database with the name #nama_database, and Import file sql to **phpmyadmin**
6. Open Postman desktop application or Chrome web app extension that has installed before
7. Choose HTTP Method and enter request url.(ex. localhost:3001/)
8. You can see all the end point [here](#end-point)

## Set up .env file

Open .env file on your favorite code editor, and copy paste this code below :

```
DB_HOST=localhost
DB_PASS=
DB_USER=root
DB_NAME=nepays

IP=127.0.0.1
PORT=3009
URL=http://localhost:8080

USER=nepaysid@gmail.com
PASS=1q0p2w9o

KEY=ITSASECRET
```
## Postman Documentation
https://universal-star-769522.postman.co/collections/12330794-62edefd4-7dc3-485f-92a5-a0dedf48caa9?version=latest&workspace=1461c9ef-c50c-4ba8-8919-f3d30685cc6d


# API Seed Project
This is a seed project for an API based on Node.js and MongoDB.
It includes user authentication and authorization using Java Web Tokens (JWT) and fileupload mechanics using Mongos GridFS. In addition, a documentation based on Swagger is automatically generated based on code commenting.
## Getting Started
### Prerequisites
If Node.js is not installed, please go to the [Node.js homepage](https://nodejs.org) to find installation instructions. 

This project uses MongoDB for data persistence, therefore MongoDB needs to be installed and running in order to execute this project. Find installation details here: [MongoDB homepage](https://www.mongodb.com/)
### Installing
After cloning/downloading, plesae run `npm install` to install dependencies.

#### Config
By default, this project runs on the port `4334`. This can be changed in the file `config.js`.

In the file `config.js` the database information needs to be provided. The hostname and port of a database serve can be specified here. If authentication is required, uncomment the marked lines.

#### HTTPS
This project is meant to be served via HTTPS. Therefore in the file `config.js` it is required to provide a path to the key and certificate. To setup a self-signed certificate you can follow these steps: [Self signed certificate](https://medium.freecodecamp.org/how-to-get-https-working-on-your-local-development-environment-in-5-minutes-7af615770eec)

If a certificate issued by a CA is needed, you can check [Let's Encrypt](https://letsencrypt.org/) and [certbot](https://certbot.eff.org/) to obtain a free signed certificate.

## How-to
Two entities are provided as examples and can be manipulated via CRUD on base of POST, GET, PUT, and DELETE. The two entities are named **Teams** and **Players** and have a 1 to many relationshit. 

The core url looks like: **/v1/teams** for teams and **/v1/players** for players.

In addition, an example to upload media files is implemented with the core url **/v1/media**
### Examples
To find all teams: **GET /v1/teams**.

To create a new team: **POST /v1/teams** with a body containing a valid teams JSON. For example:
```javascript
{
  "name": "Liverpool FC",
  "country": "England",
  "league": 1
}
```
To update a team: **PUT /v1/teams/_teamId_** with a valid teams JSON in the body.

To delete a team **DELETE /v1/teams/_teamId_**.

To find information about a certain team: **GET /v1/teams/_teamId_**.  

To find all players in one team: **GET /v1/teams/players**.

For uploading media files, e.g. images: **POST /v1/media** as formData with the image file added as value for the key: **mediaFile**. Additional metadata can be added via adding a JSON in the body wit a key **metdata**:
```javascript
{
  "metadata": "This is the logo of Liverpool FC"
}
```

### Swagger
This project uses Swagger to automatically generates a documentation based on code comments. The Swagger documentation can be accessed via: **/api-docs**. In the relevant controllers, you can find examples of code comments. More information about Swagger can be found here: [Swagger](https://swagger.io/).

## Author
This API Seed Project is created by Janosch Zbick. If you have any questions and/or comments please send an [email](mailto:janosch.zbick@gmail.com).
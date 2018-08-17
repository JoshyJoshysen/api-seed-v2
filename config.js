const fs = require('fs');

const port = 3443;
const _host = 'localhost:'+port;
//exports.host = _host;
exports.port = port;
exports.url = "https://" + _host;

//if user and password is required uncomment the relevant sections
const db = {
  db: 'api-seed_v2'
  , host: 'localhost'
  , port: 27017
  //,username: 'user'
  //,password: 'password'
};

let dbUrl = 'mongodb://';
//dbUrl += db.username+':'+db.password+'@';
dbUrl += db.host + ':' + db.port;
dbUrl += '/' + db.db;

exports.db = {
  db: db,
  url: dbUrl
};

//SSL
const key = fs.readFileSync('./ssl/localhost.key');
const cert = fs.readFileSync('./ssl/localhost.cert');

exports.ssl = {
  key: key,
  cert: cert
};

/*exports.passport = {
  'secretKey': '12345-67890-09876-54321',
  'facebook': {
    clientID: 'ID',
    clientSecret: 'SECRET',
    callbackURL: 'https://localhost:3443/users/facebook/callback'
  }
};*/

exports.swagger = {
  definition: {
    info: {
      title: 'API Seed Project',
      version: '2.0.0',
      description: 'This is a seed project for an API that has user authentication and authorization processes included. Enjoy!'
    },
    host: _host,
    securityDefinitions: {
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        description: 'Submits a token to identify a user',
        name: 'x-access-token'
      }
    },
    security: [
      {
        ApiKeyAuth: []
      }
    ],
    basePath: '/api/v1'
  }
};
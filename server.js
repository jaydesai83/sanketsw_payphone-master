'use strict';

var express = require('express');
var connect = require('connect');
var cors = require('cors');
var app = express();
var path = require('path');
var rootPath = path.normalize('./build');
var nodePort = (process.env.VCAP_APP_PORT || 3000);

var bodyParser = require("body-parser");
var Cloudant = require('cloudant');
var dataAccessCloudant = require('./services/dataAccessCloudant');
var hasConnectCloudant = false;
var cloudantNoSQLDB;

var multer = require("multer");
var fs = require('fs');

var originsWhitelist = [
  'http://localhost:3000', //this is my front-end url for development
  'http://payphone.mybluemix.net'
];
var corsOptions = {
  origin: function(origin, callback) {
    var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
    callback(null, isWhitelisted);
  },
  credentials: true
}
app.use(cors(corsOptions));

// Serve the gzip content
app.use(connect.compress());

app.use(express.static(rootPath));
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.use(bodyParser.json());


// CLOUDANT

if (process.env.VCAP_SERVICES) {
  var env = JSON.parse(process.env.VCAP_SERVICES);
  if (env['cloudantNoSQLDB']) {
    hasConnectCloudant = true;
    cloudantNoSQLDB = env['cloudantNoSQLDB'][0].credentials;
  }

}

if (hasConnectCloudant == false) {

  cloudantNoSQLDB = {
    username: "82355f51-7372-42a1-9ee0-ba521a6b26bc-bluemix",
    password: "39401478074c146c94049086aead42c2725f223ddfbc45a09cb674e1dd9d9041",
    host: "82355f51-7372-42a1-9ee0-ba521a6b26bc-bluemix.cloudant.com",
    port: 443
  };
}


var cloudant = Cloudant({account:cloudantNoSQLDB.username, password:cloudantNoSQLDB.password});

app.post('/insert', function(req, res) {
  dataAccessCloudant.insert(cloudant, req, res);
});
app.post('/query', function(req, res) {
  dataAccessCloudant.query(cloudant, req, res);
});
app.post("/upload", multer({dest: "./uploads/"}).array("uploads[]", 12), function(req, res) {
    res.send(req.files);
});

function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}

app.post('/download', function(req, res) {
  var file = __dirname + '/uploads/' + req.body.attachmentname;
  var temp = __dirname + '/uploads/' + 'temp';
  fs.writeFileSync(temp, base64_encode(file));
  res.download(temp);
});

app.listen(nodePort);
console.log(new Date() + ' Listening on port: ' + nodePort);

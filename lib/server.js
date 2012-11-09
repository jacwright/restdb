var leveldb = require('leveldb');
var express = require('express');
var msgpack = require('msgpack');
var app = express();
var db;
var bodyParser = express.bodyParser();

leveldb.open('/tmp/db', { create_if_missing: true }, function(err, theDb) {
  if (err) {
    console.error('Error connecting to or creating database!');
    return;
  }
  
  db = theDb;
  app.listen(3030);
});


app.get('*', function(req, res) {
  db.get(req.path, { as_buffer: true }, function(err, data) {
    if (err) {
      console.error(err);
      res.send(500);
    } else if (data === null) {
      res.send(404);
    } else {
      for (var i = 0; i < data.length; i++) {
        if (data[i] === 0) {
          var headers = JSON.parse(data.slice(0, i).toString('utf8'));
          data = data.slice(i + 1);
          break;
        }
      }
      for (i in headers) {
        res.setHeader(i, headers[i]);
      }
      res.end(data);
    }
  });
});


app.put('*', function(req, res) {
  var data = new Buffer(1);
  data.fill(0);
  
  req.on('data', function(chunk) {
    data = Buffer.concat([data, chunk]);
  });
  
  req.on('end', function() {
    var headers = {
      'Last-Modified': new Date().toGMTString(),
      'Content-Type': req.headers['content-type'] || 'application/octet-stream',
      'Content-Length': data.length - 1
    };
    data = Buffer.concat([ new Buffer(JSON.stringify(headers)), data ]);
    
    db.put(req.path, data, function(err) {
      if (err) {
        console.error(err);
        res.send(500);
      } else {
        res.send(204);
      }
    });
  });
});


app.post('*', function(req, res) {
  
});


app.del('*', function(req, res) {
  db.del(req.path, function(err, data) {
    if (err) {
      console.error(err);
      res.send(500);
    } else {
      res.send(204);
    }
  });
});
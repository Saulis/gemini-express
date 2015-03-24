var cleankill = require('cleankill');
var freeport = require('freeport');
var express = require('express');
var http = require('http');

function getPort(opts, cb) {
  if(opts && opts.port) {
    cb(null, opts.port);
  } else {
    freeport(function (err, port) {
      if (err) throw err;
      cb(err, port);
    });
  }
};

function Server(root) {
  var _this = this;
  var _root = root || process.cwd();

  var app = express();
  app.use(express.static(_root));

  var httpServer = http.createServer(app);

  _this.start = function(opts, cb) {
    getPort(opts, function(err, port) {
      if(err) throw err;
      httpServer.listen(port, function() {
        console.log('Express hosting ' + _root + ' at http://localhost:' + port);
        if(cb) cb('http://localhost:' + port);
      });

      httpServer.port = port;

      cleankill.onInterrupt(function(done) {
        httpServer.close(function() {
          console.log('Express closed.');
          done();
        });
      });
    });
  };

  _this.stop = function() {
    httpServer.close(function() {
      console.log('Express stopped.');
    });
  };

  return _this;
};

module.exports = Server;
var cleankill = require('cleankill');
var express = require('express');
var http = require('http');
var freeport = require('freeport');

function getPort(opts, cb) {
  if(opts.port) {
    cb(null, opts.port);
  } else {
    freeport(function (err, port) {
      if (err) throw err;
      cb(err, port);
    });
  }
}

module.exports = function(gemini, opts) {
  var root = opts.root || process.cwd();

  var app = express();
  app.use(express.static(root));

  var server = http.createServer(app);

  gemini.on('startRunner', function(runner) {
    getPort(opts, function(err, port) {
      server.listen(port);
      server.port = port;

      gemini.config.rootUrl = 'http://localhost:' + port;
      console.log('Express hosting ' + root + ' on: ' + gemini.config.rootUrl);
    });

    cleankill.onInterrupt(function(done) {
      server.close();
      console.log('Express closed.');
      done();
    });
  });

  gemini.on('endRunner', function(runner, data) {
    server.close();
    console.log('Express closed.');
  });
};

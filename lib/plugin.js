var cleankill = require('cleankill');
var express = require('express');
var http = require('http');
var freeport = require('freeport');

function getPort(opts) {
  var _port = opts.port;

  if (!_port) {
    freeport(function (err, port) {
      if (err) throw err;
      _port = port;
    });
  }

  return _port;
}

module.exports = function(gemini, opts) {
  var root = opts.root || process.cwd();
  var port = getPort(opts);

  var app = express();
  app.use(express.static(root));

  var server = http.createServer(app);

  gemini.on('startRunner', function(runner) {
    server.listen(port);
    server.port = port;
    console.log('Server hosting ' + root + ' on: http://localhost:' + port);

    cleankill.onInterrupt(function(done) {
      server.close();
      console.log('Server closed.');
      done();
    });
  });

  gemini.on('endRunner', function(runner, data) {
    server.close();
    console.log('Server closed.');
  });
};

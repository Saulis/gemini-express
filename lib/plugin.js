var Server = require('./server');
var Q = require('q');

module.exports = function(gemini, opts) {
  var server = Server(opts.root);

  gemini.on('startRunner', function(runner) {
    var deferred = Q.defer();

    server.start(opts, function(rootUrl) {
      gemini.config.rootUrl = rootUrl;
      deferred.resolve();
    });

    return deferred.promise;
  });

  gemini.on('endRunner', function(runner, data) {
    var deferred = Q.defer();

    server.stop(function() {
      deferred.resolve();
    });

    return deferred.promise;
  });
};

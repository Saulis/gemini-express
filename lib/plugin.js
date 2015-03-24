var Server = require('./server');

module.exports = function(gemini, opts) {
  var server = Server(opts.root);

  gemini.on('startRunner', function(runner) {
    server.start(opts, function(rootUrl) {
      gemini.config.rootUrl = rootUrl;
    });
  });

  gemini.on('endRunner', function(runner, data) {
    server.stop();
  });
};

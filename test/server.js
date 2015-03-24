var assert = require('chai').assert;
var expect = require('chai').expect;
var sinon = require('sinon');
var mockery = require('mockery');

describe('server', function() {
  var Server,
      app,
      express,
      httpServer,
      freeport,
      cleankill;

  beforeEach(function() {
    app = sinon.spy();
    app.use = sinon.spy();

    express = function() {
      return app;
    };

    express.static = function(path) { return path; }

    httpServer = sinon.spy();
    httpServer.listen = sinon.spy();

    var http = sinon.spy();
    http.createServer = function() {
      return httpServer;
    };

    var freeport = function(cb) {
      cb(null, 6666);
    };

    cleankill = sinon.spy();
    cleankill.onInterrupt = function(cb) {
      cleankill.listener = cb;
    }

    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false
    });

    mockery.registerMock('express', express);
    mockery.registerMock('http', http);
    mockery.registerMock('freeport', freeport);
    mockery.registerMock('cleankill', cleankill);

    Server = require('../lib/server');

    mockery.disable();
  });

  it('should serve using the root', function() {
    Server('foobar');

    assert(app.use.calledWith('foobar'));
  });

  it('should handle undefined root', function() {
    Server();

    expect(app.use.args[0][0]).to.equal(process.cwd());
  });

  describe('start', function() {

    it('should use port from options', function() {
      var server = Server();

      server.start({port: 1234});

      expect(httpServer.listen.args[0][0]).to.equal(1234);
      expect(httpServer.port).to.equal(1234);
    });

    it('should use free port if not configured', function() {
      var server = Server();

      server.start();

      expect(httpServer.listen.args[0][0]).to.equal(6666);
      expect(httpServer.port).to.equal(6666);
    });

    it('should close server on interrupt', function() {
      httpServer.close = sinon.spy();

      var server = Server();
      server.start();

      cleankill.listener(sinon.spy());

      assert(httpServer.close.called);
    });

    it('should callback with rootUrl', function(done) {
      httpServer.listen = function(port, cb) {
        cb(port);
      };

      var server = Server();

      server.start({port: 1234}, function(rootUrl) {
        expect(rootUrl).to.equal('http://localhost:1234');
        done();
      });
    });
  });

  describe('stop', function() {
    it('should close the server', function() {
      httpServer.close = sinon.spy();

      var server = Server();
      server.stop();

      assert(httpServer.close.called);
    });
  });
});
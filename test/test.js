var assert = require('chai').assert;
var expect = require('chai').expect;
var mockery = require('mockery');
var sinon = require('sinon');

describe('gemini-express', function() {
  var listeners;
  var sandbox;

  var app,
      cleankill,
      gemini,
      express,
      freeport,
      http,
      server,
      plugin;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    app = sandbox.spy();
    app.use = sandbox.spy();

    cleankill = sandbox.spy();
    cleankill.onInterrupt = function(cb) {
      cleankill.listener = cb;
    };

    gemini = sandbox.stub();
    gemini.config = sandbox.spy();
    gemini.on = function(event, callback) {
      listeners[event] = callback;
    };

    express = function() {
      return app;
    };
    express.static = sandbox.spy();

    freeport = function(cb) {
      cb(null, 6666);
    }

    server = sandbox.spy();
    server.listen = sandbox.stub();

    http = sandbox.spy();
    http.createServer = function() {
      return server;
    };

    listeners = {};

    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false
    });

    mockery.registerMock('cleankill', cleankill);
    mockery.registerMock('gemini', gemini);
    mockery.registerMock('express', express);
    mockery.registerMock('http', http);
    mockery.registerMock('freeport', freeport);

    plugin = require('../lib/plugin');

    mockery.disable();
  });

  afterEach(function() {
    sandbox.restore();
  })

  function startRunner() {
    listeners.startRunner({});
  }

  function endRunner() {
    listeners.endRunner({});
  }

  function init(opts) {
    plugin(gemini, opts);
  };

  it('should use root from options', function() {
    init({ root: 'foobar' });

    expect(express.static.args[0][0]).to.equal('foobar');
  });

  it('should start server on startRunner', function() {
    init({});
    startRunner();

    assert(server.listen.calledOnce);
  });

  it('should use port from options', function() {
    init({port: 1234});
    startRunner();

    expect(server.listen.args[0][0]).to.equal(1234);
    expect(server.port).to.equal(1234);
  });

  it('should use free port if not configured', function() {
    init({});
    startRunner();

    expect(server.listen.args[0][0]).to.equal(6666);
    expect(server.port).to.equal(6666);
  });

  it('should close server on interrupt', function() {
    server.close = sinon.spy();

    init({});
    startRunner();

    cleankill.listener(sinon.spy());

    assert(server.close.called);
  });

  it('should closer the server on endRunner', function() {
    server.close = sinon.spy();

    init({});
    endRunner();

    assert(server.close.called);
  });

  it('should set rootUrl', function() {
    init({port:1234});
    startRunner();

    expect(gemini.config.rootUrl).to.equal('http://localhost:1234');
  });
});
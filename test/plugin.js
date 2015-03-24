var assert = require('chai').assert;
var expect = require('chai').expect;
var mockery = require('mockery');
var sinon = require('sinon');

describe('gemini-express', function() {
  var listeners;
  var root,
      gemini,
      server,
      plugin;

  beforeEach(function() {
    gemini = sinon.stub();
    gemini.config = sinon.spy();
    gemini.on = function(event, callback) {
      listeners[event] = callback;
    };

    var Server = sinon.stub();
    Server.returns(server);

    server = sinon.spy();
    server.start = sinon.spy();

    listeners = {};

    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false
    });

    mockery.registerMock('./server', function(_root) { root = _root; return server; });

    plugin = require('../lib/plugin');

    mockery.disable();
  });

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

    expect(root).to.equal('foobar');
  });

  it('should use root from options', function() {
    init(true);

    expect(root).to.be.undefined;
  });

  it('should start server on startRunner', function() {
    init({});
    startRunner();

    assert(server.start.calledOnce);
  });

  it('should set rootUrl', function() {
    server.start = function(opts, cb) {
      cb('http://foo.bar');
    };

    init({});
    startRunner();

    expect(gemini.config.rootUrl).to.equal('http://foo.bar');
  });

  it('should stop the server on endRunner', function() {
    server.stop = sinon.spy();

    init({});
    endRunner();

    assert(server.stop.called);
  });
});
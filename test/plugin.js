var expect = require('chai').expect;
var mockery = require('mockery');
var sinon = require('sinon');

describe('gemini-express', function() {
  var serverRoot,
      gemini,
      server,
      plugin,
      q,
      deferred;

  before(function() {
    q = sinon.spy();
    server = sinon.spy();

    mockery.registerMock('q', q);
    mockery.registerMock('./server', function(root) { serverRoot = root; return server; });
  });

  beforeEach(function() {
    server.reset();
    server.start = sinon.spy();

    deferred = sinon.spy();
    deferred.resolve = sinon.spy();

    q.reset();
    q.defer = sinon.spy(function() {
      return deferred;
    });

    gemini = sinon.stub();
    gemini.config = sinon.spy();
    gemini.on = function(event, callback) {
      gemini[event] = callback;
    };

    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false
    });

    plugin = require('../lib/plugin');

    mockery.disable();
  });

  function init(opts) {
    plugin(gemini, opts);
  };

  describe('on startRunner', function() {
    function startRunner() {
      return gemini.startRunner({});
    }

    it('should set server root from options', function() {
      init({ root: 'foobar' });

      expect(serverRoot).to.equal('foobar');
    });

    it('should set server root from options', function() {
      init(true);

      expect(serverRoot).to.be.undefined;
    });

    it('should start server on startRunner', function() {
      init({});
      startRunner();

      expect(server.start.calledOnce);
    });

    it('should set rootUrl', function() {
      server.start = function(opts, cb) {
        cb('http://foo.bar');
      };

      init({});
      startRunner();

      expect(gemini.config.rootUrl).to.equal('http://foo.bar');
    });

    it('should return a promise on startRunner', function() {
      deferred.promise = sinon.spy();

      init({});

      expect(startRunner()).to.equal(deferred.promise);
    });
  });

  describe('on endRunner', function() {
    function endRunner() {
      return gemini.endRunner({});
    }

    beforeEach(function() {
      server.stop = sinon.spy();
      init({});
    });

    it('should stop the server on endRunner', function() {
      endRunner();

      expect(server.stop.called);
    });

    it('should return a promise on endRunner', function() {
      deferred.promise = sinon.spy();

      expect(endRunner()).to.equal(deferred.promise);
    });

    it('should resolve the given promise', function() {
      server.stop = function(cb) {
        cb();
      }

      endRunner();

      expect(deferred.resolve.called);
    });
  });
});
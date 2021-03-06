var should = require('chai').should();
var expect = require('chai').expect;

var mongoose = require('mongoose');
require('../lib/test_db_connection')(mongoose);
var customer = require('../../app/models/customer')(mongoose);
var gratitude = require('../../app/models/gratitude')(mongoose);

var _ = require('underscore');

var console = require('console');

// @IntegrationTest
describe('Gratitude', function() {

  var me;
  beforeEach(function(done) {
    customer.register('gary@email.com', 'gary', 'yo', function(err, c) {
      if (c == null) throw 'Fail to create "me" before test';
      me = c;
      done();
    });
  })

  afterEach(function(done) {
    customer.model.remove({}, function() {
      gratitude.model.remove({}, function() {
        done();
      });
    });
  });

  describe('create', function() {
    var message = 'I am grateful for the nice weather we are having today';

    it('should not create gratitude if customer is null', function(done) {
      gratitude.createGratitude(null, message, function(err, g) {
        expect(err).not.to.be.null;
        done();
      });
    });
    it('should not create gratitude if message is null or empty', function(done) {
      gratitude.createGratitude(me, null, function(err, g) {
        expect(err).not.to.be.null;
        gratitude.createGratitude(me, "", function(err, g) {
          expect(err).not.to.be.null;
          done();
        });
      });
    });
    it('should create gratitude if message is not empty', function(done) {
      gratitude.createGratitude(me, message, function(err, g) {
        expect(err).to.be.null;
        expect(g).not.to.be.null;
        done();
      });
    });
  });

  describe('findAll', function() {
    it('should list all messages of the customer', function(done) {
      var messages = ['12345', 'hello'];
      // FIXME: this is pretty ugly to just synchronously put 2 items
      gratitude.createGratitude(me, messages[0], function(err, g) {
        if (g) {
          gratitude.createGratitude(me, messages[1], function(err, g) {
            if (g) {
              gratitude.findAll(me, function(err, m) {
                var ml = _.map(m, function(i) { return i.message; });
                expect(ml).to.have.members(messages);
                expect(messages).to.have.members(ml);
                done();
              });
            }
          });
        }
      });
    });
  });
});

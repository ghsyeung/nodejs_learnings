var should = require('chai').should();
var expect = require('chai').expect;

var mongoose = require('mongoose');
require('../lib/test_db_connection')(mongoose);
var customer = require('../../app/models/customer')(mongoose);

describe('Customers', function() {
  describe('register', function() {

    afterEach(function(done) {
      customer.model.remove({}, function() {
        done();
      });
    });

    var registerExpectsError = function(email, first, last, done) {
      customer.register(email, first, last, function(err, customer) {
        expect(err).not.to.be.null;
        done();
      });
    };

    it('should return error when email is missing', function(done) {
      registerExpectsError(null, 'first', 'last', done);
    });

    it ('should return error when email is empty', function(done) {
      registerExpectsError('', 'first', 'last', done);
    });

    it ('should return customer if email is not empty', function(done) {
      customer.register('gary@email.com', 'gary', 'yeung', function(err, customer) {
        expect(customer).not.to.be.null;
        expect(customer.email).to.equal('gary@email.com');
        done();
      });
    });
  });
});


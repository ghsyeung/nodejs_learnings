var should = require('chai').should();
var expect = require('chai').expect;

var mongoose = require('mongoose');
require('../lib/test_db_connection')(mongoose);
var customer = require('../../app/models/customer')(mongoose);

describe('Customers', function() {

  afterEach(function(done) {
    customer.model.remove({}, function() {
      done();
    });
  });

  describe('register', function() {
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

  describe('findByEmail', function() {
    var gary;
    beforeEach(function(done) {
      customer.register('gary@email.com', 'gary', 'yeung', function(err, customer) {
        if (err) {
          fail('error registering customer beforeEach');
        } else {
          gary = customer;
        }
        done();
      });
    });

    it('should return null if email is null', function(done) {
      customer.findByEmail(null, function(err, customer) {
        expect(err).not.to.be.null;
        expect(customer).to.be.null;
        done();
      });
    });

    it('should return null if email does not exist', function(done) {
      customer.findByEmail('not@exists.com', function(err, customer) {
        expect(err).to.be.null;
        expect(customer).to.be.null;
        done();
      });
    });

    it('should return customer if email exists', function(done) {
      customer.findByEmail('gary@email.com', function(err, customer) {
        expect(err).to.be.null;
        expect(customer.email).to.equal(gary.email);
        done();
      });
    });
  });
});



/**
 * Module dependencies.
 */

var console = require('console');
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

var cb = require('CoolBeans');
// Use wire programmatically to wire the spec to produce
// a fully wired context.
cb = new cb('./spec.json');

// Setting up development DB
require('./config/development')(cb.get('mongoose'));

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/app/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var sendError = function(err, res) {
  res.statusCode = 500;
  res.send(http.STATUS_CODES[500] + ": " + err);
};

app.get('/users', user.list);
app.post('/api/users', function(req, res) {
  console.log("POST: ");
  console.log(req);

  var customer = cb.get('customer');
  customer.register(req.body.email, req.body.first, req.body.last, 
                    function(err, customer) {
                      if (err) {
                        sendError(err, res);
                      } else {
                        res.json(customer);
                      }
                    });
});

// FIXME: add authentication!!
app.post('/api/user/:id/gratitudes', function(req, res) {
  var customerId = req.params.id;
  console.log("Customer ID: " + customerId);
  var gratitude = cb.get('gratitude');
  var customer = cb.get('customer');
  customer.findById(customerId, function(err, c) {
    if (c) {
      gratitude.createGratitude(c, req.body.message,
                    function(err, m) {
                      if (err) {
                        sendError(err, res);
                      } else {
                        res.json(m);
                      }
                    });
    } else {
      sendError("Unable to create message", res);
    }
  });
});

var _ = require('underscore');
app.get('/api/user/:id/gratitudes', function(req, res) {
  var customerId = req.params.id;
  var gratitude = cb.get('gratitude');
  var customer = cb.get('customer');
  customer.findById(customerId, function(err, c) {
    if (c) {
      gratitude.findAll(c, function(err, messages) {
        if (!err) {
          var ml = _.map(messages, function(m) { return m.message; });
          res.json(ml);
        } else {
          res.json([]);
        }
      });
    } else {
      res.json([]);
    }
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

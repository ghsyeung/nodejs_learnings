var generate_api = require('../lib/api_token_generator');
/* Dependency
 * - mongoose
 */
var Customer = function() {

  var singleCustomerModel = null;
  var createCustomer = function(mongoose, console) {

    if (singleCustomerModel) { return singleCustomerModel; }

    var customerSchema = new mongoose.Schema({
      first: String,
      last: String,
      email: { type: String, index: { unique: true, required: true }},
      api_key: { type: String, index: { required: true }}
    });

    customerSchema.virtual('createdAt').get(function() {
      return this._id.getTimestamp;
    });

    customerSchema.pre('validate', function(next) {
      var self = this;
      (function fn() {
        key = generate_api();
        singleCustomerModel.model.findOne({ api_key : key }, function(err, c) {
          if (c) { fn(); }
          else {
            self.api_key = key;
          }
          next();
        });
      })();
    });

    singleCustomerModel = { 
      model : mongoose.model('customers', customerSchema),
      findByEmail : findByEmail,
      register: register
    };
    return singleCustomerModel;
  };

  var isValidEmail = function(email) {
    return !(email == null || email === "");
  };

  var register = function(email, first, last, cb) {
    if (isValidEmail(email)) {
      var newCustomer = new singleCustomerModel.model({ 
        email: email,
        first: first,
        last: last
      });
      newCustomer.save(cb);
    } else {
      cb({}, null);
    }
  };

  var findByEmail = function(email, cb) {
    if (email == null) {
      cb(true, null);
    } else {
      singleCustomerModel.model.findOne({email: email}, function(e, doc) {
        cb(e, doc);
      });
    }
  };

  return createCustomer;
};

module.exports = Customer();

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

  var findByEmail = function(email) {
    model.findOne({email: email}, function(e, doc) {
      if (e) {
        fail(e)
      } else {
        success(doc);
      }
    });
  };

  return createCustomer;
};

module.exports = Customer();

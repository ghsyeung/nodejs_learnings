/* Dependency
 * - mongoose
 */
var CustomerModel = function(mongoose, console) {

  var customerSchema = new mongoose.Schema({
    first: String,
    last: String,
    email: { type: String, index: { unique: true, required: true }},
  });

  var model = mongoose.model('customers', customerSchema);
  return model;

};

module.exports = CustomerModel;

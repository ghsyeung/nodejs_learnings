/* Dependency
 * - mongoose
 * - customer (model reference)
 */

var Gratitude = function() {

  var singleGratitudeModel = null;

  var createEntity = function(mongoose, console) {
    var Types = mongoose.Schema;

    if (singleGratitudeModel) { return singleGratitudeModel; }

    var gratitudeSchema = new mongoose.Schema({
      message: String,
      customer: { type: Types.ObjectId, ref: 'customers' }
    });

    singleGratitudeModel = {
      model : mongoose.model('gratitudes', gratitudeSchema),
      createGratitude: createGratitude,
      findAll: findAll
    };
    return singleGratitudeModel;
  }

  var createGratitude = function(customer, message, cb) {
    if (customer == null) {
      cb({ message: 'customer cannot be null' }, null);
    } else if (message == null || message.length === 0) {
      cb({ message: 'message cannot be null or empty' }, null);
    } else {
      var newGratitude = new singleGratitudeModel.model({
        message: message,
        customer: customer
      });
      newGratitude.save(cb);
    }
  };

  var findAll = function(customer, cb) {
    singleGratitudeModel.model.find({ customer: customer }, cb);
  };

  return createEntity;
};

module.exports = Gratitude();

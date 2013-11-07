var initOnce = function() {
  var initialized = false;

  var config = {
    db_url : 'mongodb://localhost/ttproto_test'
  };

  var initFn = function(mongoose) {
    if (!initialized) {
      mongoose.connect(config.db_url);

      initialized = true;
    }
  };
  return initFn;
};

module.exports = initOnce();

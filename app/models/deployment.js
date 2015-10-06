// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var deploymentSchema = new Schema({
  feature: String,
  smartfind: Boolean,
  deployed: Boolean,
  build_failed: Boolean,
  build_error: Number,
  test_failure: Boolean,
  meta: {
    tcUrl: String,
    website: String
  },
  created_at: Date,
  updated_at: Date
});

deploymentSchema.methods.activate = function() {
  // add some stuff to the users name
  this.active = true;
  return this.active;
};

// the schema is useless so far
// we need to create a model using it
var Deployment = mongoose.model('Deployment', deploymentSchema);

// make this available to our users in our Node applications
module.exports = Deployment;

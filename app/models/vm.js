// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var vmSchema = new Schema({
  name: String,
  active: Boolean,
  location: String,
  meta: {
    age: Number,
    website: String
  },
  created_at: Date,
  updated_at: Date
});

vmSchema.methods.activate = function() {
  // add some stuff to the users name
  this.active = true;
  return this.active;
};

// the schema is useless so far
// we need to create a model using it
var Vm = mongoose.model('Vm', vmSchema);

// make this available to our users in our Node applications
module.exports = Vm;

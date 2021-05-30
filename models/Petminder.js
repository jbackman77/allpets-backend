const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Utils = require('../utils')

// schema
const petminderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String    
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  image: {
    type: String,
    required: true 
  }   
  
}, 
{ timestamps: true })


// model
const petminderModel = mongoose.model('Petminder', petminderSchema)

// export
module.exports = petminderModel

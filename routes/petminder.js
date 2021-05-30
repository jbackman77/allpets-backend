const express = require('express')
const router = express.Router()
const Utils = require('./../utils')
const Petminder = require('./../models/Petminder')
const path = require('path')

// GET- get all pet minders ---------------------------
router.get('/', Utils.authenticateToken, (req, res) => {
  Petminder.find().populate('user', '_id firstName lastName')
    .then(petminders => {
      if(petminders == null){
        return res.status(404).json({
          message: "No pet minders found"
        })
      }
      res.json(petminders)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        message: "Problem getting petminders"
      })
    })  
})

// POST - create new petminder --------------------------------------
router.post('/', (req, res) => {
  // validate 
  if(Object.keys(req.body).length === 0){   
    return res.status(400).send({message: "Petminder content can't be empty"})
  }
  // validate - check if image file exist
  if(!req.files || !req.files.image){
    return res.status(400).send({message: "Image can't be empty"})
  }

  console.log('req.body = ', req.body)

  // image file must exist, upload, then create new haircut
  let uploadPath = path.join(__dirname, '..', 'public', 'images')
  Utils.uploadFile(req.files.image, uploadPath, (uniqueFilename) => {    
    // create new petminder
    let newPetminder = new Petminder({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      user: req.body.user,
      image: uniqueFilename,
      animal: req.body.animal,
    })
  
    newPetminder.save()
    .then(petminder => {        
      // success!  
      // return 201 status with user object
      return res.status(201).json(petminder)
    })
    .catch(err => {
      console.log(err)
      return res.status(500).send({
        message: "Problem creating petminder",
        error: err
      })
    })
  })
})

// export
module.exports = router
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url, { family: 4 })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [3, 'Nimen pituus on oltava vähintään 3 merkkiä'],
    required: [true, 'Nimi tarvitaan!'],
  },
  number: {
    type: String,
    required: [true, 'Numero tarvitaan!'],
    validate: {
      validator: function(v) {
        return /^(?=.{8,}$)\d{2,3}-\d+$/.test(v) //kiitos tekoäly
      },
      message: 'Numero ei ole oikeassa muodossa! (esim. 12-3456789 tai 123-4567890)'
    },
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
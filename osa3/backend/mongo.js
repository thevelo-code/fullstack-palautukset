const mongoose = require('mongoose')

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://fullstack:${password}@cluster0.gra47uo.mongodb.net/phoneApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: name,
  number: number,
})

if (process.argv.length === 3) {
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
            console.log(person.name, person.number)
        })
    mongoose.connection.close()
    process.exit(1)
    })
} else {
    if (process.argv.length === 5) {
        person.save().then(result => {
            console.log(`Added ${name} number ${number} to phonebook`)
            mongoose.connection.close()
            process.exit(1)
        })
    } else {
        console.log('give password, name, and number as arguments')
        mongoose.connection.close()
        process.exit(1)
    }
}

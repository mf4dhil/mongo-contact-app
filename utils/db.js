const mongoose = require('mongoose')
// const Schema = mongoose.Schema

mongoose.connect('mongodb://127.0.0.1:27017/dil')

// membuat schema
// const Contact = new Schema({
//     nama: {
//         type: String,
//         required: true
//     },
//     nohp: {
//         type: String,
//         required: true
//     },
//     email: {
//         type: String,
//         required: true
//     }
// },
// {
//     collection: 'Constacts'
// }
// )

// menambah 1 data
// const contact = mongoose.model('Contacts',Contact)

// const contact1 = new contact({
//     nama: 'Fadhil',
//     nohp: '083809510269',
//     email: 'syafwah999@gmail.com'
// })

// // Simpan ke collection
// contact1.save().then((contact) => console.log(contact))
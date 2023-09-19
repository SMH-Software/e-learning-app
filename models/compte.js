import mongoose from 'mongoose'
const Schema = mongoose.Schema

const compteModel =  new Schema({
    
    email : { type: String, require: true, unique: true},
    password : { type: String, require: true },
    role : { type: String, require: true },
   
})

/*module.exports = mongoose.model("produits", produit)*/
export default mongoose.model("Comptes", compteModel)
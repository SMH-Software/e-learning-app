import mongoose from 'mongoose'
const Schema = mongoose.Schema

const adminModel =  new Schema({
    
    nom : { type: String, require: true},
    prenom : { type: String, require: true},
    email : { type: String, require: true, unique: true},
   
})

/*module.exports = mongoose.model("produits", produit)*/
export default mongoose.model("Admin", adminModel)
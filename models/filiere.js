import mongoose from 'mongoose'
const Schema = mongoose.Schema

const filiereModel =  new Schema({
    
    libelle : { type: String, require: true, unique: true},   
   
})

/*module.exports = mongoose.model("produits", produit)*/
export default mongoose.model("Filieres", filiereModel)
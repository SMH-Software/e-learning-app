import mongoose from 'mongoose'
const Schema = mongoose.Schema

const coursModel =  new Schema({
    
    groupe : { type: String, require: true},   
    module : { type: String, require: true}, 
    type : { type: String, require: true},   
    cours : { type: String, require: true},   
    enseignant : { type: String, require: true},   
   
})

/*module.exports = mongoose.model("produits", produit)*/
export default mongoose.model("Cours", coursModel)
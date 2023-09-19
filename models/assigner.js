import mongoose from 'mongoose'
const Schema = mongoose.Schema

const assignerModel =  new Schema({
    
    classe : { type: String, require: true},   
    module : { type: String, require: true},   
    enseignant : { type: String, require: true},   
   
})

/*module.exports = mongoose.model("produits", produit)*/
export default mongoose.model("Assigners", assignerModel)
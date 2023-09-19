import mongoose from 'mongoose'
const Schema = mongoose.Schema

const affectationModel =  new Schema({
    
    module : { type: String, require: true},
    groupe : { type: String, require: true},
})

/*module.exports = mongoose.model("produits", produit)*/
export default mongoose.model("Affectation", affectationModel)
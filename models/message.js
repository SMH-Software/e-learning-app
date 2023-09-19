import mongoose from 'mongoose'
const Schema = mongoose.Schema

const messageModel =  new Schema({
    
    objet : { type: String, require: true},
    destinateur : { type: String, require: true},
    destinataire : { type: String, require: true},
    message : { type: String, require: true},
   
})

/*module.exports = mongoose.model("produits", produit)*/
export default mongoose.model("Messages", messageModel)
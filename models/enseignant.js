import mongoose from 'mongoose'
const Schema = mongoose.Schema

const enseignantModel =  new Schema({
    image : { type: String, require: true},
    matricule : { type: String, require: true, unique: true},
    civilite : { type: String, require: true},
    nom : { type: String, require: true},
    prenom : { type: String, require: true},
    email : { type: String, require: true, unique: true},
    adresse : { type: String, require: true},
    telephone : { type: Number, require: true},
    grade : { type: String, require: true},
    dateInscription : { type: String, require: true},
    archiver : { type: String, require: true, default: "non"}
   
})

/*module.exports = mongoose.model("produits", produit)*/
export default mongoose.model("Enseignants", enseignantModel)
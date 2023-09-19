import mongoose from 'mongoose'
const Schema = mongoose.Schema

const etudiantModel =  new Schema({
    
    image : { type: String, require: true},
    matricule : { type: String, require: true, unique: true},
    civilite : { type: String, require: true},
    nom : { type: String, require: true},
    prenom : { type: String, require: true},
    email : { type: String, require: true, unique: true},
    adresse : { type: String, require: true},
    telephone : { type: Number, require: true},
    dateNaissance : { type: String, require: true},
    lieuNaissance : { type: String, require: true},
    filiere : { type: String, require: true},
    groupe : { type: String, require: true},
    dateInscription : { type: String, require: true},
    archiver : { type: String, require: true, default: "non"}
   
})

/*module.exports = mongoose.model("produits", produit)*/
export default mongoose.model("Etudiants", etudiantModel)
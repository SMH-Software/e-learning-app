import express from "express";
const router = express.Router()
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
dotenv.config()

/** Fonction config */
import { isAuth } from "../config/auth.js";
import { upload } from '../multer.js'
import { upload_doc } from '../multer_doc.js'
import { options } from '../config/f-date.js'
import { Logout } from '../config/f-logout.js'

/** Models */
import assignerModel from '../models/assigner.js'
import coursModel from '../models/cours.js'

router.get("/espace-enseignant", isAuth, async (req,res) => {

   try {
        if(req.query.page){
            if(req.query.page == "les-cours-publiés"){
                const cours = await coursModel.find({ enseignant: req.session.profilEnseignant.matricule })
                const count = await coursModel.find({ enseignant: req.session.profilEnseignant.matricule }).countDocuments()
                const tabGroupe = cours.map(c => c.groupe) 
                const tabModule = cours.map(c => c.module) 
                let module = []

                for(let i = 0; i < tabGroupe.length; i++){
                    if(tabGroupe[i] != tabGroupe[i+1] || tabModule[i] != tabModule[i+1]){
                        module.push(tabGroupe[i] + " - " + tabModule[i])
                    }
                }
                
                res.render("cours", {
                    profilEnseignant: req.session.profilEnseignant,
                    allCours: cours,
                    count: count,
                    modules: module

                })
            }else if(req.query.page == "publier-nouveau-cours"){
                const allAssign = await assignerModel.find({enseignant: req.session.profilEnseignant.matricule})
                const tabGroupe = allAssign.map(g => g.classe)
                let groupes = []
               
                for(let i = 0; i < tabGroupe.length; i++){
                    if(tabGroupe[i] != tabGroupe[i+1]){
                        groupes.push(tabGroupe[i])
                    }
                }

                res.render("nouveau-cours", {
                    profilEnseignant: req.session.profilEnseignant,
                    allAssign: allAssign,
                    groupes: groupes,
                })
            }else if(req.query.page == "mon-profil"){
                res.render("profil-enseignant", {
                    profilEnseignant: req.session.profilEnseignant
                })
            }else if(req.query.page == "mes-affectations") {
                const affectations = await assignerModel.find({enseignant: {$regex: req.session.profilEnseignant.matricule}})
                const count = await assignerModel.find({enseignant: {$regex: req.session.profilEnseignant.matricule}}).countDocuments()
                res.render("affectations", {
                    profilEnseignant: req.session.profilEnseignant,
                    affectations: affectations,
                    count: count
                })
            }
        }

       
        res.render("enseignant", {
            profilEnseignant: req.session.profilEnseignant
        })

   } catch (error) {
        console.log(error)
   }
})

router.post("/add_course", isAuth, upload_doc, async (req, res) => {
    try {
        const cours = new coursModel({
            groupe: req.body.groupe,
            module: req.body.module,
            type: req.body.type,
            cours: req.file.filename,
            enseignant: req.session.profilEnseignant.matricule
        })
        await cours.save()
        req.session.success = "Cours publié avec succès !"
        res.redirect('/espace-enseignant?page=publier-nouveau-cours')
    } catch (error) {
        console.log(error)
    }
})

router.get("/delete_course", isAuth, upload_doc, async (req, res) => {
    try {
        await coursModel.findByIdAndDelete({_id: req.query.id})
        req.session.success = "Cours supprimé avec succès"
        res.redirect('/espace-enseignant?page=les-cours-publiés')
    } catch (error) {
        console.log(error)
    }
})



router.get("/logout", Logout)


export default router 
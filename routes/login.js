import express from'express'
const router = express.Router()
import compteModel from '../models/compte.js'

import adminModel from '../models/admin.js'
import enseignantModel from '../models/enseignant.js'
import etudiantModel from '../models/etudiant.js'

import bcrypt from'bcryptjs'
import dotenv from  'dotenv' 
dotenv.config()

//import function authentification
export const isAuth = (req, res, next) => {
    if(req.session.isAuth){
        next()
    }else{
        res.redirect('/')
    }
}


router.post("/login", async (req, res) => {
    try {
        
        let compte = await compteModel.findOne({email:req.body.email})
        let admin = await adminModel.findOne({email:req.body.email})
        let enseignant = await enseignantModel.findOne({email:req.body.email})
        let etudiant = await etudiantModel.findOne({email:req.body.email})
        let validPWD = await bcrypt.compare(req.body.mdp, compte.password)
        
        if(!compte){
            req.session.message = "Cet utilisateur n'existe pas"
            return res.redirect('/')
        }
   
        if(!validPWD){
            req.session.message = "E-mail ou mot de passe incorrecte !"
            return redirect('/')
            
        }else{

            req.session.isAuth = true
            if(compte.role == process.env.ADMIN){
                req.session.profilAdmin= admin
                return res.redirect('/espace-administrateur')
        
            }else if(compte.role == process.env.ENSEIGNANT){
                if(enseignant.archiver == "oui"){
                    req.session.message = "Compte suspendu ! Veuillez contacter administrateur pour résoudre ce problème"
                    return redirect('/')
                }else if(enseignant.archiver == "non"){
                    req.session.profilEnseignant = enseignant
                    return res.redirect('/espace-enseignant')
                }
              
            }else if(compte.role == process.env.ETUDIANT){
                if(etudiant.archiver == "oui"){
                    req.session.message = "Compte suspendu ! Veuillez contacter administrateur pour résoudre ce problème"
                    return redirect('/')
                }else if(etudiant.archiver == "non"){
                    req.session.profilEtudiant = etudiant
                    return res.redirect('/espace-etudiant')
                }
               
            }
        }
        
    } catch (error) {
        res.redirect('/')
    }
})

export default router


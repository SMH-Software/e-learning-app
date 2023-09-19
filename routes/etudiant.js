import express from "express";
const router = express.Router()

import { isAuth } from "../config/auth.js";
import { options } from '../config/f-date.js'
import { Logout } from '../config/f-logout.js'



import affectationModel from '../models/affectation.js'
import coursModel from '../models/cours.js'
import assignerModel from '../models/assigner.js'
import enseignantModel from '../models/enseignant.js'
import messageModel from '../models/message.js'

router.get("/espace-etudiant", isAuth, async (req,res) => { 
    try {
        if(req.query.page || req.query.content){
            if(req.query.page == "mes-cours"){
                const affectations = await assignerModel.find({classe: {$regex: req.session.profilEtudiant.groupe}})
                const cours = await coursModel.find({$and: [{type: {$regex: "Cours"}}, {module: {$regex: req.query.content}}]})
                const tds = await coursModel.find({$and: [{type: {$regex: "TD"}}, {module: {$regex: req.query.content}}]})
                const tps = await coursModel.find({$and: [{type: {$regex: "TP"}}, {module: {$regex: req.query.content}}]})
                
                const listModule = await assignerModel.find({module: {$regex: req.query.content}})
                const enseignant = await enseignantModel.findOne({matricule: listModule[0].enseignant})
                res.render("mes-cours", {
                    profilEtudiant: req.session.profilEtudiant,
                    affectations: affectations,
                    content: req.query.content,
                    cours: cours,
                    tds: tds,
                    tps: tps,
                    enseignant: enseignant
                })
            }else  if(req.query.page == "mon-profil"){
                const affectations = await assignerModel.find({classe: {$regex: req.session.profilEtudiant.groupe}})
                res.render("profil-etudiant", {
                    profilEtudiant: req.session.profilEtudiant,
                    affectations: affectations
                })
            }else  if(req.query.page == "ma-messagerie"){
                const affectations = await assignerModel.find({classe: {$regex: req.session.profilEtudiant.groupe}})
                const messageEnvoye = await messageModel.find({destinateur: {$regex: req.session.profilEtudiant.email}})
                const countEnvoye = await messageModel.find({destinateur: {$regex: req.session.profilEtudiant.email}}).countDocuments()
                const messageRecu = await messageModel.find({destinataire: {$regex: req.session.profilEtudiant.email}})
                const countRecu = await messageModel.find({destinataire: {$regex: req.session.profilEtudiant.email}}).countDocuments()
                res.render("messagerie-etudiant", {
                    profilEtudiant: req.session.profilEtudiant,
                    affectations: affectations,
                    messageEnvoye: messageEnvoye,
                    countEnvoye: countEnvoye,
                    messageRecu: messageRecu,
                    countRecu: countRecu

                })
            }else  if(req.query.page == "envoi-de-message"){
                if(req.session.success){
                    res.locals.success = req.session.success
                    req.session.success = undefined
                }
                const affectations = await assignerModel.find({classe: {$regex: req.session.profilEtudiant.groupe}})
                res.render("envoi-message", {
                    profilEtudiant: req.session.profilEtudiant,
                    affectations: affectations,
                    destinataire: req.query.destinataire
                })
            }
        }
        const affectations = await assignerModel.find({ classe: { $regex: req.session.profilEtudiant.groupe}})
        res.render("etudiant", {
            profilEtudiant: req.session.profilEtudiant,
            affectations: affectations
        })
    } catch (error) {
        console.log(error)
    }
})

router.post("/send_message", isAuth, async (req, res) => {
    const message = new messageModel({
        objet: req.body.objet,
        destinateur: req.session.profilEtudiant.email,
        destinataire: req.body.destinataire,
        message: req.body.message
    })
    await message.save()
    req.session.success = "Message envoyé avec succès"
    res.redirect('/espace-etudiant?page=ma-messagerie')
})


router.get("/logout", Logout)


export default router 
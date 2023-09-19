import express from "express";
const router = express.Router()
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
dotenv.config()

/** Fonction config */
import { isAuth } from "../config/auth.js";
import { upload } from '../multer.js'
import { options } from '../config/f-date.js'

/*** Models */
import adminModel from '../models/admin.js'
import compteModel from '../models/compte.js'
import etudiantModel from '../models/etudiant.js'
import enseignantModel from '../models/enseignant.js'
import filiereModel from '../models/filiere.js'
import groupeModel from '../models/groupe.js'
import moduleModel from '../models/module.js'
import assignerModel from '../models/assigner.js'
import affectationModel from '../models/affectation.js'



router.get("/espace-administrateur", isAuth, (req, res) => {
    res.render("admin", {profilAdmin: req.session.profilAdmin})
})
router.get("/mon-profil", isAuth, (req, res) => {
    res.render("profil-admin", {profilAdmin: req.session.profilAdmin})
})
router.get("/ajouter", isAuth, (req, res) => {
    res.render("ajouter", {profilAdmin: req.session.profilAdmin})
})
router.get("/messagerie-admin", isAuth, (req, res) => {
    res.render("messagerie-admin", {profilAdmin: req.session.profilAdmin})
})
//** Operations */
router.post("/add", async (req, res) => {
    const hashpass = await bcrypt.hash(req.body.mdp, 10)

    const admin = new adminModel({
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
    })

    const compte = new compteModel({
        email: req.body.email,
        password: hashpass,
        role: process.env.ADMIN
    })

    await admin.save()
    await compte.save()

    res.redirect('/')

    

})

/**Gestion Etudiant */
router.get("/gestion-des-etudiants", isAuth, async (req, res) => {
    
    if((req.query.action && req.query.id) || req.query.action){
        if(req.query.action == "modifier"){
            try {
                const student = await etudiantModel.findOne({_id: req.query.id})
                const filiere = await filiereModel.find()
                const groupe = await groupeModel.find()
            
                res.render("modifier-etudiant", {
                    profilAdmin: req.session.profilAdmin, 
                    student: student,
                    filiere: filiere,
                    groupe: groupe
                })
            } catch (error) {
                console.log(error)
            }
        }else if(req.query.action == "archiver"){
            try {
    
                await etudiantModel.findOneAndUpdate({_id: req.query.id}, {archiver: "oui" }, {new: true})
                
                res.redirect('/gestion-des-etudiants')
            } catch (error) {
                console.log(error)
            }
        }else if(req.query.action == "modifier-image"){
            try {
                const student = await etudiantModel.findOne({_id: req.query.id})
        
                res.render("modifier-image-etudiant", {
                    profilAdmin: req.session.profilAdmin, 
                    student: student
                })
            } catch (error) {
                console.log(error)
            }
        }else if(req.query.action == "nouvel-etudiant"){
            try {
                const filiere = await filiereModel.find()
                const groupe = await groupeModel.find()
                res.render("nouvel-etudiant", {
                    profilAdmin: req.session.profilAdmin,
                    filieres: filiere,
                    groupes: groupe
                })
            } catch (error) {
                console.log(error)
            }
        }
    }

    const students = await etudiantModel.find({archiver: {$regex: "non"}})
    const count = await etudiantModel.find({archiver: {$regex: "non"}}).countDocuments()
    const dateNaissance = students.dateNaissance

    res.render("gestion-etudiants",{
        profilAdmin: req.session.profilAdmin,
        students: students,
        dateNaissance: dateNaissance,
        count: count
    })
})
router.post("/add_student", isAuth, upload, async (req, res) => {

    const created_at = new Date().toLocaleString("fr-FR", options)
    const matricule = "ETD" + Math.floor(Math.random() * 9999)
    const hashpass = await bcrypt.hash(matricule, 10)
    const dnaissance = req.body.date_naissance

    const etudiant = new etudiantModel({
        image: req.file.filename,
        matricule: matricule,
        civilite: req.body.civilite,
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
        adresse: req.body.adresse,
        telephone: req.body.telephone,
        dateNaissance: dnaissance.toString(),
        lieuNaissance: req.body.lieu_naissance,
        filiere: req.body.filiere,
        groupe: req.body.groupe,
        dateInscription: created_at,
        
    })

    const compte = new compteModel({
        email: req.body.email,
        password: hashpass,
        role: process.env.ETUDIANT
    })

    await etudiant.save()
    await compte.save()

    req.session.message = "Etudiant enrégistré avec succès !"
    res.redirect('/gestion-des-etudiants?action=nouvel-etudiant')

})
router.post("/update_student", isAuth, upload, async (req, res) => {
    try {
       
        await etudiantModel.findOneAndUpdate({_id: req.body.id}, req.body, {new: true})
        res.redirect('/gestion-des-etudiants')
    } catch (error) {
        console.log(error)
    }
})
router.post("/update_student_image", isAuth, upload, async (req, res) => {
    try {
       
        await etudiantModel.findOneAndUpdate({_id: req.body.id}, {image: req.file.filename }, {new: true})

        res.redirect('/gestion-des-etudiants')
    } catch (error) {
        console.log(error)
    }
})


//**Gestion enseignant */ 
router.get("/gestion-des-enseignants", isAuth, async (req, res) => {
    try {
        if(req.query.action && req.query.id){
            if(req.query.action == "assigner"){
                const classe = await groupeModel.find()
                const module = await moduleModel.find()
                res.render("assigner", {profilAdmin: req.session.profilAdmin, modules: module, classes:classe, id: req.query.id})
            }
       }
        
        const teachers = await enseignantModel.find({archiver: {$regex: "non"}})
        const count = await enseignantModel.find({archiver: {$regex: "non"}}).countDocuments()
        res.render("gestion-enseignants", {
            profilAdmin: req.session.profilAdmin, 
            teachers: teachers,
            count: count
        })
    } catch (error) {
        console.log(error)
    }
    
    
})

router.get("/nouvel-enseignant", isAuth, (req, res) => {
   
    res.render("nouvel-enseignant", {profilAdmin: req.session.profilAdmin})
})
router.get("/modifier-image-enseignant/:id", isAuth, async (req, res) => {
    try {
        const teacher = await enseignantModel.findOne({_id: req.params.id})

        res.render("modifier-image-enseignant", {profilAdmin: req.session.profilAdmin, teacher: teacher})
    } catch (error) {
        console.log(error)
    }
})
router.get("/modifier-enseignant/:id", isAuth, async (req, res) => {
    try {
        const teacher = await enseignantModel.findOne({_id: req.params.id})

        res.render("modifier-enseignant", {profilAdmin: req.session.profilAdmin, teacher: teacher})
    } catch (error) {
        console.log(error)
    }
})

router.post("/add_teacher", isAuth, upload, async (req, res) => {

    const created_at = new Date().toLocaleString("fr-FR", options)
    const matricule = "ENS" + Math.floor(Math.random() * 9999)
    const hashpass = await bcrypt.hash(matricule, 10)

    const enseignant = new enseignantModel({
        image: req.file.filename,
        matricule: matricule,
        civilite: req.body.civilite,
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
        adresse: req.body.adresse,
        telephone: req.body.telephone,
        grade: req.body.grade,
        dateInscription: created_at,
        
    })

    const compte = new compteModel({
        email: req.body.email,
        password: hashpass,
        role: process.env.ENSEIGNANT
    })

    await enseignant.save()
    await compte.save()

    req.session.message = "Enseignant enrégistré avec succès !"
    res.redirect('/nouvel-enseignant')

})
router.post("/update_teacher", isAuth, upload, async (req, res) => {
    try {
       
        await enseignantModel.findOneAndUpdate({_id: req.body.id}, req.body, {new: true})
        res.redirect('/gestion-des-enseignants')
    } catch (error) {
        console.log(error)
    }
})
router.post("/update_teacher_image", isAuth, upload, async (req, res) => {
    try {
       
        await enseignantModel.findOneAndUpdate({_id: req.body.id}, {image: req.file.filename }, {new: true})

        res.redirect('/gestion-des-enseignants')
    } catch (error) {
        console.log(error)
    }
})
router.get("/archive_teacher/:id", isAuth, async (req, res) => {
    try {
    
        await enseignantModel.findOneAndUpdate({_id: req.params.id}, {archiver: "oui" }, {new: true})
        
        res.redirect('/gestion-des-enseignants')
    } catch (error) {
        console.log(error)
    }
})
router.post("/assign_teacher", isAuth, async (req, res) => {
    try {
        
        const enseignant = await enseignantModel.findOne({_id: req.body.id})

        const assign = assignerModel({
            classe: req.body.classe,
            module: req.body.module,
            enseignant: enseignant.matricule,
        })

        assign.save()
        
        res.redirect(`/gestion-des-enseignants?action=assigner&id=${enseignant._id}`)
    } catch (error) {
        console.log(error)
    }
})



/**Gestion Filières */
router.get("/gestion-des-filieres", isAuth, async (req, res) => {

    if((req.query.action && req.query.id) || req.query.action){
        if(req.query.action == "nouvelle-filiere"){
            try {
                const title = "filiere"
                res.render("nouvel-ajout", {
                    profilAdmin: req.session.profilAdmin, 
                    title: title
                })
            } catch (error) {
                console.log(error)
            }
        }else if(req.query.action = "maj-filiere"){
            try {
                const title = "filiere"
                const content = await filiereModel.findOne({_id: req.query.id})
               
                res.render("mise-a-jour", {
                    profilAdmin: req.session.profilAdmin, 
                    title: title,
                    content: content,
                })
            } catch (error) {
                console.log(error)
            }
        }
    }
    const filieres = await filiereModel.find()
    res.render("gestion-filieres", {profilAdmin: req.session.profilAdmin, filieres: filieres})
})

/**Gestion groupe */
router.get("/gestion-des-groupes", isAuth, async (req, res) => {
    
    if((req.query.action && req.query.id) || req.query.action){
        if(req.query.action == "nouveau-groupe"){
            try {
                const title = "groupe"
                res.render("nouvel-ajout", {
                    profilAdmin: req.session.profilAdmin, 
                    title: title
                })
            } catch (error) {
                console.log(error)
            }
        }else if(req.query.action = "maj-groupe"){
            try {
                const title = "groupe"
                const content = await groupeModel.findOne({_id: req.query.id})
               
                res.render("mise-a-jour", {
                    profilAdmin: req.session.profilAdmin, 
                    title: title,
                    content: content,
                })
            } catch (error) {
                console.log(error)
            }
        }
    }

    const groupes = await groupeModel.find()
    res.render("gestion-groupes", {
        profilAdmin: req.session.profilAdmin, 
        groupes: groupes
    })
})

/**Gestion module */
router.get("/gestion-des-modules", isAuth, async (req, res) => {
    
    if((req.query.action && req.query.id) || req.query.action || (req.query.action && req.query.libelle)){
        if(req.query.action == "nouveau-module"){
            try {
                const title = "module"
                res.render("nouvel-ajout", {
                    profilAdmin: req.session.profilAdmin, 
                    title: title
                })
            } catch (error) {
                console.log(error)
            }
        }else if(req.query.action == "maj-module"){
            try {
                const title = "module"
                const content = await moduleModel.findOne({_id: req.query.id})
               
                res.render("mise-a-jour", {
                    profilAdmin: req.session.profilAdmin, 
                    title: title,
                    content: content,
                })
            } catch (error) {
                console.log(error)
            }
        }else if(req.query.action == "affectation-module"){
            try {
                const title = "Affectation"
                const content = await moduleModel.findOne({_id: req.query.id})
                const groupes = await groupeModel.find()
                res.render("affectation", {
                    profilAdmin: req.session.profilAdmin, 
                    title: title,
                    content: content,
                    groupes: groupes
                })
            } catch (error) {
                console.log(error)
            }
        }else if(req.query.action == "liste-des-affectations"){
            try {
              
                const assigner = await assignerModel.find({ module: {$regex: req.query.libelle}})
                const count = await assignerModel.find({ module: {$regex: req.query.libelle}}).countDocuments()
                res.render("liste-affectations", {
                    profilAdmin: req.session.profilAdmin,
                    affectations: assigner,
                    count: count
                })
            } catch (error) {
                console.log(error)
            }
        }
    }
    const modules = await moduleModel.find()
    res.render("gestion-modules", {
        profilAdmin: req.session.profilAdmin, 
        modules: modules,
    })
})

/** Operations - Gestion Filières, classes et modules*/
router.post("/add_content", isAuth, async (req, res) => {
    
    try {
         if(req.body.title == "filiere"){
             const filiere = await filiereModel.findOne({libelle: req.body.libelle})
 
             if(filiere){
                 req.session.error = "Cette filière existe déjà"
                 return res.redirect('/gestion-des-filieres?action=nouvelle-filiere')
             }
     
             const newfiliere = new filiereModel({
                 libelle: req.body.libelle
             })
             await newfiliere.save()
 
             req.session.success = "Nouvelle filière ajoutée avec succès !"
             return res.redirect('/gestion-des-filieres')
 
         }else if(req.body.title == "groupe"){
 
             const groupe = await groupeModel.findOne({libelle: req.body.libelle})
 
             if(groupe){
                 req.session.error = "Ce groupe existe déjà"
                 return res.redirect('/gestion-des-groupes?action=nouveau-groupe')
             }
     
             const newGroupe = new groupeModel({
                 libelle: req.body.libelle
             })
             await newGroupe.save()
 
             req.session.success = "Nouvelle classe ajoutée avec succès !"
             return res.redirect('/gestion-des-groupes')
 
         }else if(req.body.title == "module"){
 
             const module = await moduleModel.findOne({libelle: req.body.libelle})
 
             if(module){
                 req.session.error = "Ce module existe déjà"
                 return res.redirect('/gestion-des-modules?action=nouveau-module')
             }
     
             const newModule = new moduleModel({
                 libelle: req.body.libelle
             })
             await newModule.save()
 
             req.session.success = "Nouveau module ajouté avec succès !"
             return res.redirect('/gestion-des-modules')
         }
         
    } catch (error) {
         console.log(error)
    }
})
router.post("/update_content", isAuth, async (req, res) => {
    try {
        if(req.body.title == "filiere"){
            await filiereModel.findOneAndUpdate({_id: req.body.id}, req.body, {new: true})

            req.session.success = "Filière modifiée avec succès !"
            return res.redirect('/gestion-des-filieres')

        }else if(req.body.title == "groupe"){

            await groupeModel.findOneAndUpdate({_id: req.body.id}, req.body, {new: true})

            req.session.success = "Classe modifiée avec succès !"
            return res.redirect('/gestion-des-classes')

        }else if(req.body.title == "module"){

            await moduleModel.findOneAndUpdate({_id: req.body.id}, req.body, {new: true})

            req.session.success = "Module modifié avec succès !"
            return res.redirect('/gestion-des-modules')

        }
        
} catch (error) {
        console.log(error)
}
})

/** Affectation */
router.post("/add_affectation", isAuth, async (req, res) => {
    try {
        const module = await moduleModel.findOne({ libelle: req.body.module})
        const affecter = new affectationModel({
            module: req.body.module,
            groupe: req.body.groupe
        })
        await affecter.save()
        req.session.success = "Module affecté avec succès !"
        res.redirect(`/gestion-des-modules?action=affectation-module&id=${module._id}`)
    } catch (error) {
        console.log(error)
    }
})









export default router 
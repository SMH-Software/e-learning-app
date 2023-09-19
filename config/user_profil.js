import mongoose from 'mongoose'
export async function profil(myModel,email) {
    try {
       const myProfil = await myModel.findOne({email:email})
       return myProfil
    } catch (error) {
        console.log(error)
    }
}

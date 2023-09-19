import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

export async function connect() {
    try {
        await mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true})
            .then(() => console.log("Connexion à la base de données établie avec succès !"))
    } catch (error) {
        console.log(error)
    }
}

/*mongoose.connect(process.env.URI, {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('Connected!')).catch((err) => console.log(err))*/

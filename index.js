import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
const app = express()
import session from 'express-session'
import connectMongoDBSession from 'connect-mongodb-session'
const MongoDBStore = connectMongoDBSession(session)
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Définir les répertoires des fichiers de modèle EJS

/** Generate Password */
import generator from 'generate-password'

//import connection config 
import { connect } from './config/db.js'

//Import my routes 
import indexRoute from './routes/index.js'
import loginRoute from './routes/login.js'
import adminRoute from './routes/admin.js'
import enseignantRoute from './routes/enseignant.js'
import etudiantRoute from './routes/etudiant.js'

//Middleware 
app.use(express.static('./public'))
app.use(express.static('./uploads'))
app.use(express.static('./uploads_doc'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())

//Initialised template
app.set('view engine', 'ejs')
app.set('views', [
    __dirname + '/views', // Premier répertoire des fichiers de modèle
    __dirname + '/views/admin', // Premier répertoire des fichiers de modèle
    __dirname + '/views/enseignant', // Deuxième répertoire des fichiers de modèle
    __dirname + '/views/etudiant', // Deuxième répertoire des fichiers de modèle
  ]);

//create and connect session 
const store =  new MongoDBStore({
    uri: process.env.DB_URI,
    collection: "mySession",
})

app.use(session({
    secret: "this is my secret key",
    resave: false,
    saveUnitialized: false,
    store: store,
}))

//Connect to the Database
connect()

//my routes
app.use("", indexRoute)
app.use("", loginRoute)
app.use("", adminRoute)
app.use("", enseignantRoute)
app.use("", etudiantRoute)

var password = generator.generate({
	length: 10,
	numbers: true
});

// 'uEyMTw32v9'
//console.log(`le mot de passe est : ${password}`);
const event = new Date();

// British English uses day-month-year order and 24-hour time without AM/PM
//console.log(event.toDateString("fr-FR"));
// Expected output: "20/12/2012, 03:00:00"
//console.log(event.toLocaleString("fr-FR", options));




app.listen(process.env.PORT, () =>{ 
    console.log(`Server running on http://localhost:${process.env.PORT}`)
   
})
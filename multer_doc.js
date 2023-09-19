import multer from 'multer'
//Upload Image 
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "./uploads_doc")
    },
    filename: function(req, file, cb){
        cb(null, file.originalname)
    },
})
  
export const upload_doc = multer({
storage: storage
}).single('cours')
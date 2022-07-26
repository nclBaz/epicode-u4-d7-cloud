import express from "express"
import multer from "multer"
import { extname } from "path"
import { saveUsersAvatars } from "../../lib/fs-tools.js"

const filesRouter = express.Router()

filesRouter.post("/single", multer({ limits: { fileSize: 1024 * 1024 } }).single("avatar"), async (req, res, next) => {
  // "avatar" needs to match precisely the name of the field appended in the FormData object coming from the FE. Otherwise multer is not going to find that file
  try {
    console.log("FILE: ", req.file)
    // find user by userId (3kg6a8l5s06609) in users.json

    // save the file as /public/img/users/3kg6a8l5s06609.gif
    // update that user by adding the path to the image, like "avatar": "/public/img/users/3kg6a8l5s06609.gif" to give the FE the possibility to display the image later on in an <img src="http://localhost:3001/public/img/users/3kg6a8l5s06609.gif" />
    const fileName = "3kg6a8l5s06609" + extname(req.file.originalname)
    await saveUsersAvatars(fileName, req.file.buffer)
    res.send("UPLOADED")
  } catch (error) {
    next(error)
  }
})

filesRouter.post("/multiple", multer().array("avatars"), async (req, res, next) => {
  try {
    console.log("FILES: ", req.files)
    const arrayOfPromises = req.files.map(file => saveUsersAvatars(file.originalname, file.buffer))
    await Promise.all(arrayOfPromises)
    res.send("UPLOADED")
  } catch (error) {
    next(error)
  }
})

export default filesRouter

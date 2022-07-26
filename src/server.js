// const express = require("express") // OLD SYNTAX (we don't want to use old stuff)
import express from "express" // NEW SYNTAX (you can use this only if type:"module" is added on package.json)
import listEndpoints from "express-list-endpoints"
import cors from "cors"
import { join } from "path"
import usersRouter from "./apis/users/index.js"
import booksRouter from "./apis/books/index.js"
import filesRouter from "./apis/files/index.js"
import { badRequestHandler, notFoundHandler, unauthorizedHandler, genericServerErrorHandler } from "./errorHandlers.js"

const server = express()

const port = process.env.PORT || 3001
const publicFolderPath = join(process.cwd(), "./public")

// *************************************** MIDDLEWARES ***********************************

const loggerMiddleware = (req, res, next) => {
  console.log(`Request method: ${req.method} -- Request URL: ${req.url} -- ${new Date()}`)
  console.log("Req body: ", req.body)
  // const check = true
  // if (check) {
  //   res.status(400).send({ message: "ERRORRRRRRRRRRRRR" })
  // } else {
  //   next()
  // }
  next()
}

server.use(express.static(publicFolderPath))
server.use(cors()) // If you want to connect FE to this BE you must use cors middleware
server.use(express.json()) // GLOBAL MIDDLEWARE If you don't add this line BEFORE the endpoints all requests'bodies will be UNDEFINED
server.use(loggerMiddleware) // GLOBAL MIDDLEWARE

// **************************************** ENDPOINTS ************************************
server.use("/users", usersRouter) // /users will be the prefix that all the endpoints in the usersRouter will have
server.use("/books", loggerMiddleware, booksRouter) // ROUTER LEVEL MIDDLEWARE
server.use("/files", filesRouter)

// ************************************** ERROR HANDLERS *********************************

server.use(badRequestHandler)
server.use(unauthorizedHandler)
server.use(notFoundHandler)
server.use(genericServerErrorHandler)

server.listen(port, () => {
  console.table(listEndpoints(server))
  console.log("Server is running on port: ", port)
  console.log("DATABASE CONNECTION: ", process.env.DB_CONNECTION)
  console.log("MY_SECRET_TOKEN: ", process.env.MY_SECRET_TOKEN)
})

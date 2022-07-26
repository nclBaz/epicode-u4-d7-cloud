// const express = require("express") // OLD SYNTAX (we don't want to use old stuff)
import express from "express" // NEW SYNTAX (you can use this only if type:"module" is added on package.json)
import listEndpoints from "express-list-endpoints"
import cors from "cors"
import { join } from "path"
import usersRouter from "./apis/users/index.js"
import booksRouter from "./apis/books/index.js"
import filesRouter from "./apis/files/index.js"
import { badRequestHandler, notFoundHandler, unauthorizedHandler, genericServerErrorHandler } from "./errorHandlers.js"
import createHttpError from "http-errors"

const server = express()

const port = process.env.PORT || 3001
const publicFolderPath = join(process.cwd(), "./public")

// *************************************** MIDDLEWARES ***********************************

// *************************** CORS ************************

// CORS - CROSS-ORIGIN RESOURCE SHARING

/*

CROSS-ORIGIN REQUESTS:

1. FE=http://localhost:3000 and BE=http://localhost:3001 <-- 2 different port numbers they represent 2 different ORIGINS
2. FE=https://mywonderfulfe.com and BE=https://mywonderfulbe.com <-- 2 different domains they represent 2 different ORIGINS
3. FE=https://domain.com and BE=http://domain.com <-- 2 different protocols they represent 2 different ORIGINS

*/

const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL]

server.use(
  cors({
    origin: (origin, corsNext) => {
      // If you want to connect FE to this BE you must use cors middleware
      console.log("ORIGIN: ", origin)

      if (!origin || whitelist.indexOf(origin) !== -1) {
        // if origin is in the whitelist we can move next
        corsNext(null, true)
      } else {
        // if origin is NOT in the whitelist --> trigger an error
        corsNext(createHttpError(400, `Cors Error! Your origin ${origin} is not in the list!`))
      }
    },
  })
)

// *********************************************************

server.use(express.static(publicFolderPath))
server.use(express.json()) // GLOBAL MIDDLEWARE If you don't add this line BEFORE the endpoints all requests'bodies will be UNDEFINED

// **************************************** ENDPOINTS ************************************
server.use("/users", usersRouter) // /users will be the prefix that all the endpoints in the usersRouter will have
server.use("/books", booksRouter) // ROUTER LEVEL MIDDLEWARE
server.use("/files", filesRouter)

// ************************************** ERROR HANDLERS *********************************

server.use(badRequestHandler)
server.use(unauthorizedHandler)
server.use(notFoundHandler)
server.use(genericServerErrorHandler)

server.listen(port, () => {
  console.table(listEndpoints(server))
  console.log("Server is running on port: ", port)
})

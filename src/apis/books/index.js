// ************************************************ BOOKS RELATED ENDPOINTS ***************************************************

/* *********************************************** BOOKS CRUD ENDPOINTS *******************************************************

1. CREATE --> POST http://localhost:3001/books/ (+body)
2. READ --> GET http://localhost:3001/books/
3. READ (single book) --> GET http://localhost:3001/books/:bookId 
4. UPDATE (single book) --> PUT http://localhost:3001/books/:bookId (+body)
5. DELETE (single book) --> DELETE http://localhost:3001/books/:bookId

*/

import express from "express"
import uniqid from "uniqid"
import createHttpError from "http-errors"
import { checkBookSchema, checkValidationResult } from "./validation.js"
import { getBooks, writeBooks, getUsers } from "../../lib/fs-tools.js"

const booksRouter = express.Router()

booksRouter.post("/", checkBookSchema, checkValidationResult, async (req, res, next) => {
  try {
    const newBook = { ...req.body, createdAt: new Date(), id: uniqid() }
    const books = await getBooks()

    books.push(newBook)

    await writeBooks(books)

    res.status(201).send({ id: newBook.id })
  } catch (error) {
    next(error)
  }
})

booksRouter.get("/", async (req, res, next) => {
  try {
    const books = await getBooks()
    // const users = await getUsers()
    //throw new Error("KABOOOOOOOOOOOOOOOOOOOOOOOOOOOM!")
    if (req.query && req.query.category) {
      const filteredBooks = books.filter(book => book.category === req.query.category)
      res.send(filteredBooks)
    } else {
      // res.send({ users, books })
      res.send(books)
    }
  } catch (error) {
    next(error) // this is going to "jump" to the error handlers
  }
})

booksRouter.get("/:bookId", async (req, res, next) => {
  try {
    const books = await getBooks()

    const foundBook = books.find(book => book.id === req.params.bookId)
    if (foundBook) {
      res.send(foundBook)
    } else {
      next(createHttpError(404, `Book with id ${req.params.bookId} not found!`)) // this is creating not a normal error, but an error with a STATUS CODE (in this case 404)
    }
  } catch (error) {
    next(error)
  }
})

booksRouter.put("/:bookId", async (req, res, next) => {
  try {
    const books = await getBooks()

    const index = books.findIndex(book => book.id === req.params.bookId)
    if (index !== -1) {
      const oldBook = books[index]

      const updatedBook = { ...oldBook, ...req.body, updatedAt: new Date() }

      books[index] = updatedBook

      await writeBooks(books)

      res.send(updatedBook)
    } else {
      next(createHttpError(404, `Book with id ${req.params.bookId} not found!`))
      // res.status(404).send()
    }
  } catch (error) {
    next(error)
  }
})

booksRouter.delete("/:bookId", async (req, res, next) => {
  try {
    const books = await getBooks()

    const remainingBooks = books.filter(book => book.id !== req.params.bookId)

    await writeBooks(remainingBooks)

    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

export default booksRouter

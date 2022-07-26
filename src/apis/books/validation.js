import { checkSchema, validationResult } from "express-validator"
import createHttpError from "http-errors"

const bookSchema = {
  title: {
    in: ["body"],
    isString: {
      errorMessage: "Title is a mandatory field and needs to be a string!",
    },
  },
  category: {
    in: ["body"],
    isString: {
      errorMessage: "Category is a mandatory field and needs to be a string!",
    },
  },
  // email: {
  //   in: ["body"],
  //   isEmail: {
  //     errorMessage: "Email must be a valid email address!",
  //   },
  // },
}
// Validation middlewares chain 1. checkBookSchema --> 2. checkValidationResult

export const checkBookSchema = checkSchema(bookSchema) // the checkSchema function will give us a middleware that checks req bodies

export const checkValidationResult = (req, res, next) => {
  // check if previous middleware (checkBookSchema) has found any error
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    // If we have any validation error --> trigger 400
    next(createHttpError(400, "Validation errors in request body!", { errorsList: errors.array() }))
  } else {
    // Else (no errors) --> normal flow
    next()
  }
}

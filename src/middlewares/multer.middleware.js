import multer from 'multer'
import { multerOptions } from '../shared/config/multerOptions.js'
import { AppError } from '../shared/errors/appError.js'

const upload = multer({ storage: multerOptions.storage })

export const multerMiddleware = (request, response, next) => {
  upload.array('images', 10)(request, response, error => {
    if (error instanceof AppError) return response.status(error.statusCode).json({ error: error.message })
    request.body.images = request.files.map(file => file.filename)
    next()
  })
}

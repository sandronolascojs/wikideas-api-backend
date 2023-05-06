import path from 'node:path'
import multer from 'multer'
import { dirname } from './route.utils.js'
import { AppError } from '../errors/appError.js'

const uploadDestination = path.resolve(dirname, 'src', 'public', 'uploads')

export const multerOptions = {
  storage: multer.diskStorage({
    destination: function (request, file, callback) {
      callback(null, uploadDestination)
    },
    filename: function (request, file, callback) {
      const allowedMimes = [
        'image/jpeg',
        'image/pjpeg',
        'image/png',
        'image/gif'
      ]
      const random = Math.floor(Math.random() * 1000000000000000)
      if (!allowedMimes.includes(file.mimetype)) {
        callback(new AppError(`Invalid file type: ${file.mimetype.split('/')[1]}`, 415))
      } else {
        callback(null, `${random}-${file.originalname}`)
      }
    },
    limits: {
      fileSize: 2 * 1024 * 1024
    }
  }),
  uploadDestination
}

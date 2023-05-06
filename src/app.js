import path from 'node:path'
import express from 'express'
import swagger from 'swagger-ui-express'
import expressRateLimit from 'express-rate-limit'
import helmet from 'helmet'
import cors from 'cors'
import { categoriesRoutes } from './routes/categories.routes.js'
import { articlesRoutes } from './routes/articles.routes.js'
import { dirname } from './shared/config/route.utils.js'
import swaggerDoc from './swagger.docs.json' assert {
  type: 'json',
}

const uploadDestination = path.resolve(dirname, 'src', 'public', 'uploads')

const rateLimit = expressRateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again in 15 minutes',
  legacyHeaders: true,
  standardHeaders: true,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests, please try again in 15 minutes'
    })
  }
})

export const app = express()

app.use(express.json())
app.use(rateLimit)
app.use(helmet())
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
}))

app.use('/api/docs', swagger.serve, swagger.setup(swaggerDoc))
app.use('/api/storage', express.static(path.resolve(uploadDestination)))
app.use('/api/categories', categoriesRoutes)
app.use('/api/articles', articlesRoutes)
app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error)
  }
  res.status(error.code || 500)
  res.json({
    error: error.message || 'An unknown error occurred!'
  })
})

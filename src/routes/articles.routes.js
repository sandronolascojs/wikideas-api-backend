import { Router } from 'express'
import { articlesController } from '../controllers/articles.controller.js'
import { multerMiddleware } from '../middlewares/multer.middleware.js'

const articlesRoutes = Router()

articlesRoutes.get('/', articlesController.getAllArticles)
articlesRoutes.get('/:id', articlesController.getArticleById)
articlesRoutes.post('/', multerMiddleware, articlesController.createArticle)

export { articlesRoutes }

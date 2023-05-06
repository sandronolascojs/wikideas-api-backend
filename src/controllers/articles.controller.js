import { promises } from 'node:fs'
import { articleRepository } from '../db/repositories/articlesRepository.js'
import { categoryRepository } from '../db/repositories/categoriesRepository.js'
import { FilterParams } from '../middlewares/filterParams.js'
import { multerOptions } from '../shared/config/multerOptions.js'
import { ArticleView } from '../views/article.view.js'
import { FilterQueries } from '../middlewares/filterQueries.js'

export const getAllArticles = async (request, response) => {
  const { limit, offset, sort, category } = request.query
  if (limit && isNaN(limit)) return response.status(400).json({ error: 'limit must be a number' })
  if (offset && isNaN(offset)) return response.status(400).json({ error: 'offset must be a number' })
  if (sort && !['asc', 'desc'].includes(sort)) return response.status(400).json({ error: 'sort must be asc or desc' })
  const hasErrors = FilterQueries.validate(['limit', 'offset', 'sort', 'category'], request.query)
  if (hasErrors) return response.status(400).json(hasErrors)
  if (category) {
    const categoryExists = await categoryRepository.findByName(category)
    if (!categoryExists) return response.status(400).json({ error: 'Category does not exist' })
    const articles = await articleRepository.findAll({ limit, offset, sort, category: categoryExists._id.toString() })
    return response.status(200).json({
      articles: ArticleView.renderMany(articles.docs),
      totalPages: articles.totalPages,
      page: articles.page,
      totalArticles: articles.totalDocs,
      hasPrevPage: articles.hasPrevPage,
      hasNextPage: articles.hasNextPage,
      prevPage: articles.prevPage,
      nextPage: articles.nextPage
    })
  }
  const articles = await articleRepository.findAll({ limit, offset, sort })
  return response.status(200).json({
    articles: ArticleView.renderMany(articles.docs),
    totalPages: articles.totalPages,
    page: articles.page,
    totalArticles: articles.totalDocs,
    hasPrevPage: articles.hasPrevPage,
    hasNextPage: articles.hasNextPage,
    prevPage: articles.prevPage,
    nextPage: articles.nextPage
  })
}

export const getArticleById = async (request, response) => {
  const { id } = request.params
  const article = await articleRepository.findById(id)
  if (!article) return response.status(404).json({ error: 'Article not found' })
  return response.status(200).json(ArticleView.render(article))
}

export const createArticle = async (request, response) => {
  const { title, description, markdown, images, category } = request.body
  const requiredParams = ['title', 'description', 'markdown', 'category']
  const optionalParams = ['images']
  const filterParams = FilterParams.validate(requiredParams, request.body, optionalParams)
  if (filterParams) return response.status(400).json(filterParams)
  const categoryToDb = category.split(',')
  const categoryPromises = categoryToDb.map(async (category) => {
    return categoryRepository.findById(category)
  })
  const categoryExists = await Promise.all(categoryPromises)
  if (categoryExists.includes(false)) {
    images.forEach(async (image) => {
      await promises.unlink(`${multerOptions.uploadDestination}/${image}`)
    })
    return response.status(400).json({ error: 'Category does not exist' })
  }
  const article = await articleRepository.create({ title, description, markdown, images, category: categoryToDb })
  categoryExists.forEach(async (category) => {
    await categoryRepository.updateById(category._id, { articles: [...category.articles, article._id] })
  })
  return response.status(201).send()
}

export const articlesController = {
  getAllArticles,
  getArticleById,
  createArticle
}

import { categoryRepository } from '../db/repositories/categoriesRepository.js'
import { FilterParams } from '../middlewares/filterParams.js'
import { FilterQueries } from '../middlewares/filterQueries.js'
import { CategoryView } from '../views/category.view.js'

export const getAllCategories = async (request, response) => {
  const { limit, offset, sort } = request.query
  if (limit && isNaN(limit)) return response.status(400).json({ error: 'limit must be a number' })
  if (offset && isNaN(offset)) return response.status(400).json({ error: 'offset must be a number' })
  if (sort && !['asc', 'desc'].includes(sort)) return response.status(400).json({ error: 'sort must be asc or desc' })
  const hasErrors = FilterQueries.validate(['limit', 'offset', 'sort'], request.query)
  if (hasErrors) return response.status(400).json(hasErrors)
  const categories = await categoryRepository.findAll({ limit, offset, sort })
  return response.status(200).json({
    categories: CategoryView.renderMany(categories.docs),
    totalPages: categories.totalPages,
    page: categories.page,
    totalcategories: categories.totalDocs,
    hasPrevPage: categories.hasPrevPage,
    hasNextPage: categories.hasNextPage,
    prevPage: categories.prevPage,
    nextPage: categories.nextPage
  })
}

export const getCategoryById = async (request, response) => {
  const { id } = request.params
  const category = await categoryRepository.findById(id)
  if (!category) return response.status(404).json({ error: 'Category not found' })
  return response.status(200).json(CategoryView.render(category))
}

export const createCategory = async (request, response) => {
  const { name, description } = request.body
  const hasErrors = FilterParams.validate(['name', 'description'], request.body)
  if (hasErrors) return response.status(400).json(hasErrors)
  await categoryRepository.create({ name, description })
  return response.status(201).send()
}

export const categoriesController = {
  getAllCategories,
  getCategoryById,
  createCategory
}

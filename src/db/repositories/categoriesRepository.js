import { Category } from '../models/categories.model.js'

export class CategoryRepository {
  model = null

  constructor (model) {
    this.model = model
  }

  async create ({ name, description }) {
    const category = this.model({ name, description })
    await category.save()
  }

  async findAll ({ limit, offset, sort }) {
    const limitOfPages = limit || 10
    const offsetOfPages = offset || 0
    const sortOfPages = sort || 'asc'
    // use find with paginate plugin and add populate
    const categories = await this.model.paginate({}, {
      limit: limitOfPages,
      offset: offsetOfPages,
      sort: { createdAt: sortOfPages },
      populate: { path: 'articles', select: 'title description images' }
    })

    return categories
  }

  async exists (id) {
    return await this.model.find({ _id: { $in: id } }).count() > 0
  }

  async findById (id) {
    const category = await this.model.findById(id).populate('articles', {
      _id: 1,
      title: 1,
      description: 1,
      images: 1
    })
    return category
  }

  async findByName (name) {
    const category = await this.model.findOne({ name })
    return category
  }

  async updateById (id, { name, description, articles }) {
    await this.model.findByIdAndUpdate(id, { name, description, articles }, { new: true })
  }

  async deleteById (id) {
    await this.model.findByIdAndDelete(id)
  }
}

export const categoryRepository = new CategoryRepository(Category)

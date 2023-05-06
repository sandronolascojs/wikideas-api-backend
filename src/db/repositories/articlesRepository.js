import { Article } from '../models/articles.model.js'

export class ArticleRepository {
  model = null

  constructor (model) {
    this.model = model
  }

  async create ({ title, description, markdown, images, category }) {
    const article = this.model({ title, description, markdown, images, category })
    await article.save()
    return article
  }

  async findAll ({ limit, offset, sort, category }) {
    const limitOfPages = limit || 10
    const offsetOfPages = offset || 0
    const sortOfPages = sort || 'asc'
    if (category) {
      const articles = await this.model.paginate({ category: { $in: category } }, {
        limit: limitOfPages,
        offset: offsetOfPages,
        sort: { createdAt: sortOfPages },
        populate: {
          path: 'category',
          select: {
            _id: 1,
            name: 1,
            description: 1
          }
        }
      })
      return articles
    }
    const articles = await this.model.paginate({}, {
      limit: limitOfPages,
      offset: offsetOfPages,
      sort: { createdAt: sortOfPages },
      populate: {
        path: 'category',
        select: {
          _id: 1,
          name: 1,
          description: 1
        }
      }
    })
    return articles
  }

  async findById (id) {
    const article = await this.model.findById(id).populate('category', {
      _id: 1,
      name: 1
    })
    return article
  }

  async updateById (id, { title, description, markdown, images }) {
    const article = await this.model.findByAndUpdate(id, { title, description, markdown, images }, { new: true })
    return article
  }

  async exists (id) {
    const article = await this.model.find({ _id: { $in: id } }).count() > 0
    console.log(article)
    return !!article
  }

  async deleteById (id) {
    await this.model.findByIdAndDelete(id)
  }
}

export const articleRepository = new ArticleRepository(Article)

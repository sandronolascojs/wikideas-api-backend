
export class CategoryView {
  static render (category) {
    return {
      id: category.id,
      name: category.name,
      description: category.description,
      articles: category.articles.map(article => ({
        id: article.id,
        title: article.title,
        description: article.description,
        markdown: article.markdown,
        images: article.images.map(image => `${process.env.STORAGE}/${image}`),
        createdAt: article.createdAt,
        updatedAt: article.updatedAt
      })),
      createdAt: category.createdAt,
      updatedAt: category.updatedAt
    }
  }

  static renderMany (category) {
    return category.map(category => this.render(category))
  }
}

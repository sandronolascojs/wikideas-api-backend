
export class ArticleView {
  static render (article) {
    return {
      id: article.id,
      title: article.title,
      description: article.description,
      markdown: article.markdown,
      images: article.images.map(image => `${process.env.STORAGE}/${image}`),
      category: article.category.map(category => ({
        id: category.id,
        name: category.name
      })),
      createdAt: article.createdAt,
      updatedAt: article.updatedAt
    }
  }

  static renderMany (articles) {
    return articles.map(article => this.render(article))
  }
}

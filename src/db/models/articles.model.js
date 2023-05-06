import { Schema, model } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const articleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  markdown: {
    type: String,
    required: true,
    length: 10000
  },
  images: [String],
  category: [{
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  }]
}, {
  versionKey: false,
  timestamps: true
})

articleSchema.plugin(mongoosePaginate)

export const Article = model('Article', articleSchema)

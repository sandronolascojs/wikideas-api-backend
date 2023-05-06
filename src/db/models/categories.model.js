import { Schema, model } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const categoriesSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  articles: [{
    type: Schema.Types.ObjectId,
    ref: 'Article'
  }]
}, {
  versionKey: false,
  timestamps: true
})

categoriesSchema.plugin(mongoosePaginate)

export const Category = model('Category', categoriesSchema)

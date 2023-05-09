import { connect } from 'mongoose'

export const dbConnect = async () => {
  try {
    const db = await connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log(`MongoDB connected: ${db.connection.host}`)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

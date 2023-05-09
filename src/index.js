import dotenv from 'dotenv'
dotenv.config()
import { dbConnect } from './db/config/dbConfig.js'
import { app } from './app.js'

const PORT = process.env.PORT
app.listen(PORT, async () => {
  await dbConnect()
  console.log(`Server is running on port ${PORT}`)
})

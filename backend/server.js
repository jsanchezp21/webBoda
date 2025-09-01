import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import guestRoutes from './routes/guests.js'
import authRoutes from './routes/auth.js';

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api/auth', authRoutes);
app.use('/api/guests', guestRoutes)

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB conectado')
  app.listen(process.env.PORT, () =>
    console.log(`Servidor en puerto ${process.env.PORT}`)
  )
}).catch((err) => console.error(err))

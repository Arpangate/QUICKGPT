import express from 'express';
import "dotenv/config"
import cors from 'cors'
import connectDB from './configs/db.js';
import userRouter from './routes/userRoutes.js';
// import mongoose from 'mongoose';
// import "./models/User.js"
// import "./models/Chat.js"
// // import "./models/Message.js"
// // import "./models/Plan.js"
// // import "./models/Transaction.js"

import chatRouter from './routes/chatRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import creditRouter from './routes/creditRoutes.js';
import { stripeWebhooks } from './controllers/webhooks.js';


const app = express();

await connectDB();

// Stripe webhooks
app.post('/api/stripe', express.raw({type: 'application/json'}), stripeWebhooks)

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.get('/', (req, res) => res.send('Server is Live!'))
app.use('/api/user', userRouter)
app.use('/api/chat', chatRouter)
app.use('/api/message', messageRouter)
app.use('/api/credit', creditRouter)

const PORT = process.env.PORT || 3000

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})



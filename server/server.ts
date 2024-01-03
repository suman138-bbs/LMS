import { app } from './app';
import connectDB from './utils/db';




//create our server

app.listen(process.env.PORT, () => {
    connectDB()
    console.log(`server is connected with port ${process.env.PORT} `)
})

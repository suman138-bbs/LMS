import mongoose from 'mongoose';
const db_uri = process.env.DB_URI || ''

const connectDB = async () => {
    try {
        await mongoose.connect(db_uri)
        console.log("DB connected successfully")
    } catch (error) {
        console.log(error)
        setTimeout(connectDB,5000)
    }
}

export default connectDB

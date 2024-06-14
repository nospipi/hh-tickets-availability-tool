import mongoose, { connect } from "mongoose"
mongoose.set("strictQuery", true)

const MONGODB_URI = process.env.MONGO_CONNECTION_PROD

if (!MONGODB_URI || MONGODB_URI.length === 0) {
  throw new Error("Please add your MongoDB URI to .env")
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB() {
  if (cached.conn) {
    console.log("🚀 Using cached mongodb connection")
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log("✅ New connection to mongodb established")
        return mongoose
      })
      .catch((error) => {
        console.error("❌ Connection to mongodb database failed")
        throw error
      })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default connectDB

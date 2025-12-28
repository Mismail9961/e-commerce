// File: lib/db.js
import mongoose from "mongoose";

const MAX_RETRIES = 3;
const RETRY_INTERVAL = 5000;

class DatabaseConnection {
  constructor() {
    this.retryCount = 0;
    this.isConnected = false;

    mongoose.set("strictQuery", true);

    mongoose.connection.on("connected", () => {
      console.log(
        `✅ MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`
      );
      this.isConnected = true;
      this.retryCount = 0;
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
      this.isConnected = false;
    });

    mongoose.connection.on("disconnected", () => {
      console.log("⚠️ MongoDB disconnected");
      this.isConnected = false;
    });
  }

  async connect() {
    // Check if already connected
    if (this.isConnected || mongoose.connection.readyState === 1) {
      return;
    }

    // Check if connection is in progress
    if (mongoose.connection.readyState === 2) {
      console.log("⏳ MongoDB connection already in progress...");
      await new Promise((resolve) => {
        const checkConnection = setInterval(() => {
          if (mongoose.connection.readyState === 1) {
            clearInterval(checkConnection);
            resolve();
          }
        }, 100);
      });
      return;
    }

    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    try {
      const options = {
        // Connection Pool
        maxPoolSize: 10,
        minPoolSize: 2,
        
        // Timeouts
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000,
        
        // ⚠️ CRITICAL: DO NOT SET TLS OPTIONS HERE
        // MongoDB SRV connection handles SSL/TLS automatically
        // Setting tls: true causes SSL version conflicts on Vercel
        
        // Network
        family: 4, // Use IPv4
        
        // Retry
        retryWrites: true,
        retryReads: true,
        
        // Other
        bufferCommands: false,
      };

      if (process.env.NODE_ENV === "development" && !mongoose.get("debug")) {
        mongoose.set("debug", true);
      }

      console.log("🔄 Attempting to connect to MongoDB...");
      await mongoose.connect(process.env.MONGODB_URI, options);
      
      this.retryCount = 0;
      console.log("✅ MongoDB connection established successfully");
    } catch (error) {
      console.error("❌ Failed to connect to MongoDB:", error.message);
      
      if (process.env.NODE_ENV === "development") {
        console.error("Full error details:", error);
      }
      
      await this.handleConnectionError(error);
    }
  }

  async handleConnectionError(error) {
    if (this.retryCount < MAX_RETRIES) {
      this.retryCount++;
      console.log(
        `🔄 Retrying connection... Attempt ${this.retryCount} of ${MAX_RETRIES}`
      );
      
      await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL));
      
      return this.connect();
    } else {
      const errorMessage = `MongoDB connection failed after ${MAX_RETRIES} retries`;
      console.error(`❌ ${errorMessage}`);
      throw new Error(`${errorMessage}: ${error.message}`);
    }
  }

  getConnectionStatus() {
    const { readyState, host, name } = mongoose.connection;
    
    const states = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };

    return {
      isConnected: this.isConnected,
      readyState,
      readyStateText: states[readyState] || "unknown",
      host: host || null,
      name: name || null,
    };
  }

  async disconnect() {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log("🔌 MongoDB connection closed");
    }
  }
}

const dbConnection = new DatabaseConnection();

export default dbConnection.connect.bind(dbConnection);
export const getDBStatus = dbConnection.getConnectionStatus.bind(dbConnection);
export const disconnectDB = dbConnection.disconnect.bind(dbConnection);

// Graceful shutdown
if (process.env.NODE_ENV !== "production") {
  process.on("SIGINT", async () => {
    await dbConnection.disconnect();
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    await dbConnection.disconnect();
    process.exit(0);
  });
}
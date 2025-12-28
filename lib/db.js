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
      this.retryCount = 0; // Reset retry count on successful connection
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
      return; // Already connected
    }

    // Check if connection is in progress
    if (mongoose.connection.readyState === 2) {
      console.log("⏳ MongoDB connection already in progress...");
      // Wait for the connection to complete
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
        // Connection Pool Settings
        maxPoolSize: 10,
        minPoolSize: 2,
        maxIdleTimeMS: 10000,
        
        // Timeout Settings
        serverSelectionTimeoutMS: 10000, // Increased from 5000
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000,
        
        // SSL/TLS Configuration (CRITICAL FOR VERCEL)
        tls: true,
        tlsAllowInvalidCertificates: false,
        tlsAllowInvalidHostnames: false,
        
        // Network Settings
        family: 4, // Use IPv4, skip trying IPv6
        
        // Retry Configuration
        retryWrites: true,
        retryReads: true,
        
        // Other Settings
        autoIndex: process.env.NODE_ENV === "development",
        bufferCommands: false, // Disable mongoose buffering
        
        // Application Name (helps with monitoring)
        appName: process.env.APP_NAME || "NextJS-Ecommerce",
      };

      // Enable debug mode in development
      if (process.env.NODE_ENV === "development" && !mongoose.get("debug")) {
        mongoose.set("debug", true);
      }

      console.log("🔄 Attempting to connect to MongoDB...");
      await mongoose.connect(process.env.MONGODB_URI, options);
      
      this.retryCount = 0;
      console.log("✅ MongoDB connection established successfully");
    } catch (error) {
      console.error("❌ Failed to connect to MongoDB:", error.message);
      
      // Log more details in development
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
      
      // Wait before retrying
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

// Create singleton instance
const dbConnection = new DatabaseConnection();

// Export the connect function
export default dbConnection.connect.bind(dbConnection);

// Export additional utility functions
export const getDBStatus = dbConnection.getConnectionStatus.bind(dbConnection);
export const disconnectDB = dbConnection.disconnect.bind(dbConnection);

// Graceful shutdown handlers
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
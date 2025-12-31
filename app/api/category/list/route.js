// File: app/api/category/list/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Category } from "@/models/Product";

// Server-side cache
let categoriesCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export async function GET(req) {
  try {
    // Check if cache is valid
    const now = Date.now();
    const isCacheValid = categoriesCache && cacheTimestamp && (now - cacheTimestamp < CACHE_DURATION);

    // Return cached data if valid
    if (isCacheValid) {
      return NextResponse.json({
        success: true,
        data: categoriesCache,
        cached: true,
      });
    }

    // Fetch fresh data from database
    await connectDB();

    const categories = await Category.find({ isActive: true })
      .sort({ name: 1 })
      .select("name")
      .lean(); // Use lean() for better performance

    // Update cache
    categoriesCache = categories;
    cacheTimestamp = now;

    return NextResponse.json({
      success: true,
      data: categories,
      cached: false,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// Optional: Add a POST endpoint to manually clear cache (useful after adding/updating categories)
export async function POST(req) {
  try {
    const body = await req.json();
    
    if (body.action === "clearCache") {
      categoriesCache = null;
      cacheTimestamp = null;
      
      return NextResponse.json({
        success: true,
        message: "Cache cleared successfully",
      });
    }

    return NextResponse.json(
      { success: false, message: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process request" },
      { status: 500 }
    );
  }
}
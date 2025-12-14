// File: /app/api/product-pages-seo/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import ProductPagesSeo from "@/models/ProductPagesSeo";

// GET - Fetch Product Pages SEO Settings
export async function GET() {
  try {
    await connectDB();

    let seoSettings = await ProductPagesSeo.findOne({ 
      identifier: "product-pages-seo" 
    });

    // Create default settings if none exist
    if (!seoSettings) {
      seoSettings = await ProductPagesSeo.create({
        identifier: "product-pages-seo",
        title: "Our Products | Gaming Hub",
        description: "Browse our collection of gaming products",
        keywords: ["gaming", "products", "online store"],
      });
    }

    return NextResponse.json({
      success: true,
      data: seoSettings,
    });
  } catch (error) {
    console.error("Error fetching product pages SEO:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Update Product Pages SEO Settings
export async function POST(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin access required." },
        { status: 401 }
      );
    }

    await connectDB();

    const data = await request.json();

    // Find existing settings or create new
    let seoSettings = await ProductPagesSeo.findOne({ 
      identifier: "product-pages-seo" 
    });

    if (seoSettings) {
      // Update existing - only update the fields from data
      seoSettings.title = data.title;
      seoSettings.description = data.description;
      seoSettings.keywords = data.keywords;
      seoSettings.canonicalUrl = data.canonicalUrl || "";
      seoSettings.openGraph = data.openGraph;
      seoSettings.structuredData = data.structuredData;
      seoSettings.socialMedia = data.socialMedia;
      seoSettings.updatedBy = session.user.id || session.user.email;
      
      await seoSettings.save();
    } else {
      // Create new
      seoSettings = await ProductPagesSeo.create({
        identifier: "product-pages-seo",
        title: data.title,
        description: data.description,
        keywords: data.keywords,
        canonicalUrl: data.canonicalUrl || "",
        openGraph: data.openGraph,
        structuredData: data.structuredData,
        socialMedia: data.socialMedia,
        updatedBy: session.user.id || session.user.email,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Product Pages SEO settings updated successfully",
      data: seoSettings,
    });
  } catch (error) {
    console.error("Error updating product pages SEO:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Reset to Default Settings
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin access required." },
        { status: 401 }
      );
    }

    await connectDB();

    // Delete existing and let GET create default
    await ProductPagesSeo.deleteOne({ identifier: "product-pages-seo" });

    return NextResponse.json({
      success: true,
      message: "SEO settings reset to default",
    });
  } catch (error) {
    console.error("Error resetting product pages SEO:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
// app/api/seo/route.js
import connectDB from "@/lib/db";
import Seo from "@/models/Seo";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET - Fetch current SEO settings (public access)
export async function GET() {
  try {
    await connectDB();
    let seo = await Seo.findOne();
    
    // If no SEO document exists, create default one
    if (!seo) {
      seo = await Seo.create({
        title: "QuickCart - GreatStack",
        description: "E-Commerce with Next.js",
        keywords: ["ecommerce", "nextjs", "online shopping"],
        openGraph: {
          title: "QuickCart - GreatStack",
          description: "E-Commerce with Next.js",
          url: "",
          siteName: "QuickCart",
          locale: "en_US",
          type: "website"
        }
      });
    }
    
    return NextResponse.json({ success: true, seo });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// POST - Update SEO settings (admin/seller only)
export async function POST(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please login." },
        { status: 401 }
      );
    }

    // Check if user is admin or seller
    if (session.user.role !== 'admin' && session.user.role !== 'seller') {
      return NextResponse.json(
        { success: false, message: "Access denied. Admin or Seller role required." },
        { status: 403 }
      );
    }

    await connectDB();
    const data = await request.json();
    
    // Find existing SEO document or create new one
    let seo = await Seo.findOne();
    
    if (seo) {
      // Update existing
      seo.title = data.title;
      seo.description = data.description;
      seo.keywords = data.keywords;
      seo.openGraph = data.openGraph;
      await seo.save();
    } else {
      // Create new
      seo = await Seo.create(data);
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "SEO settings updated successfully",
      seo 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
// app/api/category-seo/[slug]/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import CategorySeo from '@/models/CategorySeo';

// GET single category SEO by slug (for frontend use)
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    // In Next.js 15, params is a Promise, so we need to await it
    const { slug } = await params;
    
    const category = await CategorySeo.findOne({ 
      categorySlug: slug,
      isActive: true 
    });
    
    if (!category) {
      return NextResponse.json({
        success: false,
        error: 'Category SEO not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: category
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching category SEO:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch category SEO data'
    }, { status: 500 });
  }
}
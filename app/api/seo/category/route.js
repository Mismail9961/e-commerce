// ============================================
// FILE 1: app/api/admin/category-seo/route.js
// ============================================
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import CategorySeo from '@/models/CategorySeo';

// GET - Fetch all category SEO data
export async function GET(request) {
  try {
    await connectDB();
    
    const categories = await CategorySeo.find({}).sort({ categorySlug: 1 });
    
    return NextResponse.json({
      success: true,
      data: categories
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching category SEO:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch category SEO data'
    }, { status: 500 });
  }
}

// POST - Create or update category SEO
export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { categorySlug, categoryName, seo, isActive } = body;
    
    // Validation
    if (!categorySlug || !categoryName || !seo?.title || !seo?.description) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 });
    }
    
    // Check if category already exists
    const existingCategory = await CategorySeo.findOne({ categorySlug });
    
    if (existingCategory) {
      // Update existing
      existingCategory.categoryName = categoryName;
      existingCategory.seo = seo;
      existingCategory.isActive = isActive;
      
      await existingCategory.save();
      
      return NextResponse.json({
        success: true,
        message: 'Category SEO updated successfully',
        data: existingCategory
      }, { status: 200 });
      
    } else {
      // Create new
      const newCategory = await CategorySeo.create({
        categorySlug,
        categoryName,
        seo,
        isActive
      });
      
      return NextResponse.json({
        success: true,
        message: 'Category SEO created successfully',
        data: newCategory
      }, { status: 201 });
    }
    
  } catch (error) {
    console.error('Error saving category SEO:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to save category SEO data'
    }, { status: 500 });
  }
}

// DELETE - Delete a category SEO
export async function DELETE(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('slug');
    
    if (!categorySlug) {
      return NextResponse.json({
        success: false,
        error: 'Category slug is required'
      }, { status: 400 });
    }
    
    const deletedCategory = await CategorySeo.findOneAndDelete({ categorySlug });
    
    if (!deletedCategory) {
      return NextResponse.json({
        success: false,
        error: 'Category not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Category SEO deleted successfully'
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error deleting category SEO:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete category SEO data'
    }, { status: 500 });
  }
}


// // ============================================
// // FILE 2: app/api/category-seo/[slug]/route.js
// // ============================================
// import { NextResponse } from 'next/server';
// import connectDB from '@/lib/db';
// import CategorySeo from '@/models/CategorySeo';

// // GET single category SEO by slug (for frontend use)
// export async function GET(request, { params }) {
//   try {
//     await connectDB();
    
//     // In Next.js 15, params is a Promise, so we need to await it
//     const { slug } = await params;
    
//     const category = await CategorySeo.findOne({ 
//       categorySlug: slug,
//       isActive: true 
//     });
    
//     if (!category) {
//       return NextResponse.json({
//         success: false,
//         error: 'Category SEO not found'
//       }, { status: 404 });
//     }
    
//     return NextResponse.json({
//       success: true,
//       data: category
//     }, { status: 200 });
    
//   } catch (error) {
//     console.error('Error fetching category SEO:', error);
//     return NextResponse.json({
//       success: false,
//       error: 'Failed to fetch category SEO data'
//     }, { status: 500 });
//   }
// }
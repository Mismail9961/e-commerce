// File: /api/cart/remove-deleted-product/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
export async function POST(request) {
  try {
    await connectDB();
    
    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { success: false, error: "Product ID is required" },
        { status: 400 }
      );
    }

    console.log("Removing product from all carts:", productId);

    // Since cartItems is an object like {"productId": quantity}
    // We need to unset the field with the productId as the key
    const unsetField = {};
    unsetField[`cartItems.${productId}`] = "";

    const result = await User.updateMany(
      { [`cartItems.${productId}`]: { $exists: true } },
      { $unset: unsetField }
    );

    console.log(`Product removed from ${result.modifiedCount} user carts`);

    return NextResponse.json({
      success: true,
      message: "Product removed from all carts",
      modifiedCount: result.modifiedCount
    });

  } catch (error) {
    console.error("Error removing product from carts:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
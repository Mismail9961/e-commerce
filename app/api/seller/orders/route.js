// File: /api/admin/all-orders/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated and is an admin
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    if (session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin access required." },
        { status: 403 }
      );
    }

    await connectDB();

    console.log("Admin fetching all orders");

    // Fetch ALL orders from the database, newest first
    const orders = await Order.find({})
      .sort({ date: -1 })
      .lean();

    console.log(`Found ${orders.length} total orders`);

    if (orders.length === 0) {
      return NextResponse.json({ 
        success: true, 
        orders: [],
        message: "No orders found" 
      });
    }

    // Populate product details for each order
    const ordersWithProducts = await Promise.all(
      orders.map(async (order) => {
        const itemsWithProducts = await Promise.all(
          order.items.map(async (item) => {
            try {
              const productId = typeof item.product === 'string' 
                ? item.product 
                : item.product.toString();

              let product;
              try {
                product = await Product.findOne({ _id: productId });
              } catch (err) {
                product = await Product.findById(productId);
              }

              if (!product) {
                console.log(`Product not found: ${productId}`);
                return {
                  product: {
                    _id: productId,
                    name: "Product Unavailable",
                    price: 0,
                    image: []
                  },
                  quantity: item.quantity,
                  _id: item._id
                };
              }

              return {
                product: {
                  _id: product._id,
                  name: product.name,
                  price: product.price,
                  offerPrice: product.offerPrice,
                  image: product.image
                },
                quantity: item.quantity,
                _id: item._id
              };
            } catch (error) {
              console.error(`Error fetching product ${item.product}:`, error);
              return {
                product: {
                  _id: item.product,
                  name: "Error Loading Product",
                  price: 0,
                  image: []
                },
                quantity: item.quantity,
                _id: item._id
              };
            }
          })
        );

        return {
          ...order,
          _id: order._id.toString(),
          items: itemsWithProducts
        };
      })
    );

    console.log(`Returning ${ordersWithProducts.length} orders with product details`);

    return NextResponse.json({ 
      success: true, 
      orders: ordersWithProducts 
    });
  } catch (err) {
    console.error("Error fetching all orders:", err);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch orders",
        details: err.message 
      },
      { status: 500 }
    );
  }
}
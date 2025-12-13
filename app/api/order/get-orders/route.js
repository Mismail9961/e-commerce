// app/api/order/get-orders/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    console.log("Session in get-orders:", session);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    await connectDB();

    const userRole = session.user.role;
    console.log("User role:", userRole, "User ID:", session.user.id);

    let orders;

    // Admin and Seller can see all orders
    if (userRole === "admin" || userRole === "seller") {
      console.log("Fetching all orders for admin/seller");
      orders = await Order.find({})
        .sort({ date: -1 })
        .lean();
    } else {
      // Regular users see only their own orders
      console.log("Fetching orders for regular user:", session.user.id);
      orders = await Order.find({ userId: session.user.id })
        .sort({ date: -1 })
        .lean();
    }

    console.log("Raw orders found:", orders.length);

    if (orders.length === 0) {
      return NextResponse.json({ 
        success: true, 
        orders: [],
        message: "No orders found" 
      });
    }

    // Manually populate product details
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
                  product: productId,
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
                product: item.product,
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

    console.log("Orders with products:", ordersWithProducts.length);

    return NextResponse.json({ 
      success: true, 
      orders: ordersWithProducts,
      totalOrders: ordersWithProducts.length,
      userRole: userRole
    });
  } catch (err) {
    console.error("Error fetching orders:", err);
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
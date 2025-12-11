'use client';
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Loading from "@/components/Loading";
import axios from "axios";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

const Orders = () => {
    const { currency, router } = useAppContext();
    const { data: session } = useSession();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSellerOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await axios.get("/api/seller/orders", { withCredentials: true });
            if (data.success) {
                setOrders(data.orders || []);
            } else {
                setError(data.error || "Failed to fetch orders");
            }
        } catch (err) {
            console.error("Error fetching seller orders:", err);
            if (err.response?.status === 401) {
                setError("Please login to view orders");
                router.push('/login');
            } else if (err.response?.status === 403) {
                setError("Unauthorized. Seller access required.");
            } else {
                setError(err.response?.data?.error || "Failed to fetch orders");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (session?.user?.role === "seller" || session?.user?.role === "admin") {
            fetchSellerOrders();
        }
    }, [session]);

    if (loading) {
        return (
            <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm bg-[#003049] text-white">
                <Loading />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm bg-[#003049] text-white">
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <p className="text-xl text-[#9d0208] mb-4">{error}</p>
                        <button
                            onClick={() => router.push("/")}
                            className="px-6 py-2 bg-[#9d0208] text-white rounded hover:bg-[#7a0006] transition"
                        >
                            Go to Home
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm bg-[#003049] text-white">
            <div className="md:p-10 p-4 space-y-5">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium text-[#9d0208]">Orders</h2>
                    <button
                        onClick={fetchSellerOrders}
                        className="px-4 py-2 bg-[#9d0208]/20 text-[#9d0208] rounded hover:bg-[#9d0208]/30 transition text-xs"
                    >
                        Refresh
                    </button>
                </div>

                {/* No Orders */}
                {orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <p className="text-xl text-gray-400 mb-4">No orders found</p>
                        <p className="text-sm text-gray-500">Orders containing your products will appear here</p>
                    </div>
                ) : (
                    <div className="max-w-4xl rounded-md">

                        {orders.map((order) => (
                            <div
                                key={order._id}
                                className="flex flex-col md:flex-row gap-5 justify-between p-5 border-t border-[#9d0208]/40"
                            >
                                {/* Order Info */}
                                <div className="flex-1 flex gap-5 max-w-80">
                                    <Image
                                        className="max-w-16 max-h-16 object-cover"
                                        src={assets.box_icon}
                                        alt="box_icon"
                                    />

                                    <div className="flex flex-col gap-3 text-white">
                                        <span className="font-medium">
                                            {order.items && order.items.length > 0 ? (
                                                order.items.map((item, idx) => {
                                                    const productName = item.product?.name || "Unknown Product";
                                                    return (
                                                        <span key={idx}>
                                                            {productName} x {item.quantity}
                                                            {idx < order.items.length - 1 ? ", " : ""}
                                                        </span>
                                                    );
                                                })
                                            ) : (
                                                "No items"
                                            )}
                                        </span>

                                        <span className="text-xs text-gray-400">
                                            Items: {order.totalItems || order.items?.length || 0}
                                        </span>

                                        <span className="text-xs text-gray-400">
                                            Customer: {order.customer?.name || "N/A"}
                                        </span>

                                        {/* Status Badge */}
                                        <span
                                            className={`text-xs px-2 py-1 rounded inline-block w-fit font-medium ${
                                                order.status === "Delivered"
                                                    ? "bg-green-900/40 text-green-300"
                                                    : order.status === "Cancelled"
                                                    ? "bg-red-900/40 text-red-300"
                                                    : order.status === "Shipped"
                                                    ? "bg-blue-900/40 text-blue-300"
                                                    : "bg-yellow-900/40 text-yellow-300"
                                            }`}
                                        >
                                            {order.status || "Order Placed"}
                                        </span>
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="text-gray-300 text-sm">
                                    <p>
                                        <span className="font-medium text-white">{order.address?.fullName || "N/A"}</span>
                                        <br />
                                        <span>{order.address?.area || ""}</span>
                                        <br />
                                        <span>{`${order.address?.city || ""}, ${order.address?.state || ""}`}</span>
                                        <br />
                                        <span>{order.address?.phoneNumber || ""}</span>
                                    </p>
                                </div>

                                {/* Amount */}
                                <div className="flex flex-col items-end">
                                    <p className="font-medium text-white">
                                        {currency}
                                        {order.sellerAmount?.toFixed(2) || order.amount?.toFixed(2) || "0.00"}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">Your Products</p>
                                </div>

                                {/* Payment Info */}
                                <div className="text-sm text-gray-300">
                                    <p className="flex flex-col">
                                        <span>Method: COD</span>
                                        <span>Date: {order.date ? new Date(order.date).toLocaleDateString() : "N/A"}</span>

                                        <span
                                            className={`font-medium ${
                                                order.paymentType === "Paid"
                                                    ? "text-green-400"
                                                    : order.paymentType === "Refunded"
                                                    ? "text-red-400"
                                                    : order.paymentType === "Pending"
                                                    ? "text-yellow-400"
                                                    : "text-gray-400"
                                            }`}
                                        >
                                            Payment: {order.paymentType || "COD"}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
};

export default Orders;

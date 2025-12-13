import React from 'react';
import Link from 'next/link';
import { assets } from '../../assets/assets';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

const SideBar = () => {
    const pathname = usePathname();
    const { data: session } = useSession();

    const userRole = session?.user?.role;

    // Seller can only access these
    const sellerMenuItems = [
        { name: 'Add Product', path: '/seller', icon: assets.add_icon },
        { name: 'Product List', path: '/seller/product-list', icon: assets.product_list_icon },
        { name: 'Orders', path: '/seller/orders', icon: assets.order_icon },
    ];

    // Admin can access everything (seller items + admin-only items)
    const adminOnlyMenuItems = [
        { name: 'All Users', path: '/seller/users', icon: assets.user_icon || assets.add_icon },
        { name: 'SEO Settings', path: '/seller/seo', icon: assets.seo_icon || assets.add_icon },
        { name: 'Category SEO', path: '/seller/category', icon: assets.seo_icon || assets.add_icon },
    ];

    // Determine which menu items to show based on role
    const getMenuItems = () => {
        if (userRole === 'admin') {
            // Admin sees everything
            return [...sellerMenuItems, ...adminOnlyMenuItems];
        } else if (userRole === 'seller') {
            // Seller only sees seller items
            return sellerMenuItems;
        }
        // Default: no access
        return [];
    };

    const menuItems = getMenuItems();

    // If no role or invalid role, don't render sidebar
    if (!userRole || (userRole !== 'admin' && userRole !== 'seller')) {
        return null;
    }

    return (
        <div className="md:w-64 w-16 bg-gradient-to-b from-[#001d2e] to-[#003049] min-h-screen border-r border-white/10 flex flex-col py-4 shadow-2xl">
            
            {/* Sidebar Header */}
            <div className="px-4 mb-6 hidden md:block">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-[#9d0208] rounded-full animate-pulse"></div>
                    <h3 className="text-white font-bold text-sm uppercase tracking-wider">
                        {userRole === 'admin' ? 'Admin Panel' : 'Seller Panel'}
                    </h3>
                </div>
                <p className="text-xs text-gray-400 pl-4">
                    {session?.user?.name || session?.user?.email}
                </p>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 space-y-1 px-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.path;

                    return (
                        <Link href={item.path} key={item.name}>
                            <div
                                className={`flex items-center py-3 px-3 gap-3 rounded-lg transition-all duration-200 group relative
                                    ${isActive
                                        ? "bg-[#9d0208] text-white shadow-lg shadow-[#9d0208]/30"
                                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                {/* Active Indicator */}
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                                )}

                                {/* Icon */}
                                <div className={`relative ${isActive ? 'scale-110' : 'group-hover:scale-105'} transition-transform`}>
                                    <Image
                                        src={item.icon}
                                        alt={item.name}
                                        className={`w-6 h-6 ${isActive ? 'brightness-0 invert' : 'brightness-75 invert opacity-70 group-hover:opacity-100'}`}
                                    />
                                </div>

                                {/* Label */}
                                <p className={`md:block hidden text-sm font-medium ${isActive ? 'font-semibold' : 'font-normal'}`}>
                                    {item.name}
                                </p>

                                {/* Tooltip for mobile */}
                                <div className="md:hidden absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-xl">
                                    {item.name}
                                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* Role Badge */}
            <div className="px-4 py-3 mt-4 border-t border-white/10">
                <div className={`px-3 py-2 rounded-lg text-center ${
                    userRole === 'admin' 
                        ? 'bg-[#9d0208]/20 border border-[#9d0208]/30' 
                        : 'bg-white/5 border border-white/10'
                }`}>
                    <p className="text-xs font-semibold uppercase tracking-wider">
                        <span className={userRole === 'admin' ? 'text-[#9d0208]' : 'text-white'}>
                            {userRole === 'admin' ? '👑 Admin' : '🛍️ Seller'}
                        </span>
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5 md:block hidden">
                        {userRole === 'admin' ? 'Full Access' : 'Limited Access'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SideBar;
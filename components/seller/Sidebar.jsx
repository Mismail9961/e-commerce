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
            return [...sellerMenuItems, ...adminOnlyMenuItems];
        } else if (userRole === 'seller') {
            return sellerMenuItems;
        }
        return [];
    };

    const menuItems = getMenuItems();

    // If no role or invalid role, don't render sidebar
    if (!userRole || (userRole !== 'admin' && userRole !== 'seller')) {
        return null;
    }

    return (
        <div className="w-14 xs:w-16 sm:w-20 md:w-64 bg-gradient-to-b from-[#001d2e] to-[#003049] min-h-screen border-r border-white/10 flex flex-col py-2 sm:py-3 md:py-4 shadow-2xl">
            
            {/* Sidebar Header */}
            <div className="px-2 sm:px-3 md:px-4 mb-3 sm:mb-4 md:mb-6 hidden md:block">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-[#9d0208] rounded-full animate-pulse"></div>
                    <h3 className="text-white font-bold text-xs sm:text-sm uppercase tracking-wider">
                        {userRole === 'admin' ? 'Admin Panel' : 'Seller Panel'}
                    </h3>
                </div>
                <p className="text-[10px] sm:text-xs text-gray-400 pl-4 truncate">
                    {session?.user?.name || session?.user?.email}
                </p>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 space-y-0.5 sm:space-y-1 px-1 sm:px-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.path;

                    return (
                        <Link href={item.path} key={item.name}>
                            <div
                                className={`flex items-center justify-center md:justify-start py-2.5 sm:py-3 px-2 sm:px-3 gap-2 sm:gap-3 rounded-md sm:rounded-lg transition-all duration-200 group relative
                                    ${isActive
                                        ? "bg-[#9d0208] text-white shadow-lg shadow-[#9d0208]/30"
                                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                {/* Active Indicator */}
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 sm:w-1 h-6 sm:h-8 bg-white rounded-r-full"></div>
                                )}

                                {/* Icon */}
                                <div className={`relative ${isActive ? 'scale-110' : 'group-hover:scale-105'} transition-transform flex-shrink-0`}>
                                    <Image
                                        src={item.icon}
                                        alt={item.name}
                                        width={20}
                                        height={20}
                                        className={`w-5 h-5 sm:w-6 sm:h-6 ${isActive ? 'brightness-0 invert' : 'brightness-75 invert opacity-70 group-hover:opacity-100'}`}
                                    />
                                </div>

                                {/* Label - hidden on mobile, visible on md+ */}
                                <p className={`hidden md:block text-xs sm:text-sm font-medium ${isActive ? 'font-semibold' : 'font-normal'} truncate`}>
                                    {item.name}
                                </p>

                                {/* Tooltip for mobile/tablet */}
                                <div className="md:hidden absolute left-full ml-1.5 sm:ml-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-900 text-white text-[10px] xs:text-xs rounded-md sm:rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-xl">
                                    {item.name}
                                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-[3px] sm:border-4 border-transparent border-r-gray-900"></div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* Role Badge */}
            <div className="px-1.5 sm:px-2 md:px-4 py-2 sm:py-3 mt-2 sm:mt-3 md:mt-4 border-t border-white/10">
                <div className={`px-1.5 sm:px-2 md:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-center ${
                    userRole === 'admin' 
                        ? 'bg-[#9d0208]/20 border border-[#9d0208]/30' 
                        : 'bg-white/5 border border-white/10'
                }`}>
                    <p className="text-[10px] xs:text-xs font-semibold uppercase tracking-wider">
                        <span className={userRole === 'admin' ? 'text-[#9d0208]' : 'text-white'}>
                            <span className="hidden xs:inline">{userRole === 'admin' ? '👑 ' : '🛍️ '}</span>
                            <span className="hidden md:inline">{userRole === 'admin' ? 'Admin' : 'Seller'}</span>
                            <span className="md:hidden">{userRole === 'admin' ? '👑' : '🛍️'}</span>
                        </span>
                    </p>
                    <p className="text-[8px] xs:text-[10px] text-gray-500 mt-0.5 hidden md:block">
                        {userRole === 'admin' ? 'Full Access' : 'Limited Access'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SideBar;
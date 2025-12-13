"use client";

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

    const sellerMenuItems = [
        { name: 'Add Product', path: '/seller', icon: assets.add_icon },
        { name: 'Products', path: '/seller/product-list', icon: assets.product_list_icon },
        { name: 'Orders', path: '/seller/orders', icon: assets.order_icon },
    ];

    const adminOnlyMenuItems = [
        { name: 'Users', path: '/seller/users', icon: assets.user_icon || assets.add_icon },
        { name: 'SEO', path: '/seller/seo', icon: assets.seo_icon || assets.add_icon },
        { name: 'Category', path: '/seller/category', icon: assets.seo_icon || assets.add_icon },
    ];

    const menuItems =
        userRole === 'admin'
            ? [...sellerMenuItems, ...adminOnlyMenuItems]
            : userRole === 'seller'
            ? sellerMenuItems
            : [];

    if (!userRole) return null;

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden sm:flex md:w-64 w-16 bg-gradient-to-b from-[#001d2e] to-[#003049] min-h-screen border-r border-white/10 flex-col py-4">
                <nav className="flex-1 space-y-1 px-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link key={item.name} href={item.path}>
                                <div className={`flex items-center gap-3 px-3 py-3 rounded-lg
                                    ${isActive ? 'bg-[#9d0208] text-white' : 'text-gray-400 hover:bg-white/5'}
                                `}>
                                    <Image src={item.icon} alt={item.name} width={22} height={22} />
                                    <span className="hidden md:block text-sm">{item.name}</span>
                                </div>
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Mobile Bottom Bar (iPhone 5s) */}
            <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#003049] border-t border-white/10">
                <div className="flex justify-around items-center h-14">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link key={item.name} href={item.path}>
                                <div className="flex flex-col items-center justify-center gap-1">
                                    <Image
                                        src={item.icon}
                                        alt={item.name}
                                        width={20}
                                        height={20}
                                        className={isActive ? 'brightness-0 invert' : 'opacity-70'}
                                    />
                                    <span className={`text-[10px] ${
                                        isActive ? 'text-white' : 'text-gray-400'
                                    }`}>
                                        {item.name.split(' ')[0]}
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </>
    );
};

export default SideBar;

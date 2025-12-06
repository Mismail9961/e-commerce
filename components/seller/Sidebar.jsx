import React from 'react';
import Link from 'next/link';
import { assets } from '../../assets/assets';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

const SideBar = () => {
    const pathname = usePathname();
    const { data: session } = useSession();

    const baseMenuItems = [
        { name: 'Add Product', path: '/seller', icon: assets.add_icon },
        { name: 'Product List', path: '/seller/product-list', icon: assets.product_list_icon },
        { name: 'Orders', path: '/seller/orders', icon: assets.order_icon },
    ];

    const adminMenuItems = [
        { name: 'All Users', path: '/seller/users', icon: assets.user_icon || assets.add_icon },
        { name: 'SEO Settings', path: '/seller/seo', icon: assets.seo_icon || assets.add_icon },
    ];

    const menuItems =
        session?.user?.role === 'admin' || session?.user?.role === 'seller'
            ? [...baseMenuItems, ...adminMenuItems]
            : baseMenuItems;

    return (
        <div className="md:w-64 w-16 bg-black min-h-screen border-r border-[#9d0208] flex flex-col py-2">
            {menuItems.map((item) => {
                const isActive = pathname === item.path;

                return (
                    <Link href={item.path} key={item.name}>
                        <div
                            className={`flex items-center py-3 px-4 gap-3 transition-all duration-200 
                                ${isActive
                                    ? "bg-[#9d0208]/20 border-r-4 border-[#9d0208]"
                                    : "hover:bg-[#9d0208]/10"
                                }`}
                        >
                            <Image
                                src={item.icon}
                                alt={item.name}
                                className="w-7 h-7 brightness-0 invert"
                            />
                            <p className="md:block hidden text-sm font-medium text-white">
                                {item.name}
                            </p>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
};

export default SideBar;

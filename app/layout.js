// app/layout.js
import { Outfit } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";
import SessionWrapper from "@/components/SessionWrapper";
import connectDB from "@/lib/db";
import Seo from "@/models/Seo";

const outfit = Outfit({ subsets: ['latin'], weight: ["300", "400", "500"] })

async function getSeoData() {
  try {
    await connectDB();
    const seoData = await Seo.findOne().lean();
    return seoData;
  } catch (error) {
    console.error("Error fetching SEO data:", error);
    return null;
  }
}

export async function generateMetadata() {
  const seoData = await getSeoData();
  
  if (!seoData) {
    return {
      title: "7even86gamehub.pk",
      description: "Your one-stop shop for gaming consoles, accessories, and more in Pakistan.",
    };
  }

  return {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    openGraph: {
      title: seoData.openGraph?.title || seoData.title,
      description: seoData.openGraph?.description || seoData.description,
      url: seoData.openGraph?.url || "",
      siteName: seoData.openGraph?.siteName || "",
      locale: seoData.openGraph?.locale || "en_US",
      type: seoData.openGraph?.type || "website",
    },
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${outfit.className} antialiased text-gray-700`}>
        <Toaster />
        <SessionWrapper>
          <AppContextProvider>
            {children}
          </AppContextProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
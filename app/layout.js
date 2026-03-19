// app/layout.js
import { Outfit } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";
import SessionWrapper from "@/components/SessionWrapper";
import connectDB from "@/lib/db";
import Seo from "@/models/Seo";

const outfit = Outfit({ subsets: ['latin'], weight: ["300", "400", "500"] })

const DEFAULT_METADATA_BASE = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com';

function normalizeUrl(url) {
  if (!url) return null;
  try {
    return new URL(url).toString();
  } catch {
    return null;
  }
}

async function getSeoData() {
  if (!process.env.MONGODB_URI) {
    // In build or CI env without a DB, skip fetching and use defaults
    console.warn("MONGODB_URI not set; skipping SEO DB fetch in generateMetadata");
    return null;
  }

  try {
    await connectDB();
    const seoData = await Seo.findOne().sort({ updatedAt: -1 });
    return seoData;
  } catch (error) {
    console.error("Error fetching SEO data:", error);
    return null;
  }
}

export async function generateMetadata() {
  const seoData = await getSeoData();
  
  const defaultOgUrl = normalizeUrl(DEFAULT_METADATA_BASE) || "https://example.com";

  if (!seoData) {
    return {
      metadataBase: new URL(DEFAULT_METADATA_BASE),
      title: "",
      description: "",
      openGraph: {
        url: defaultOgUrl,
        title: "",
        description: "",
        siteName: "",
        locale: "en_US",
        type: "website",
      },
    };
  }

  const rawOgUrl = seoData.openGraph?.url?.trim();
  const validOgUrl = normalizeUrl(rawOgUrl) || normalizeUrl(DEFAULT_METADATA_BASE) || "https://example.com";

  return {
    metadataBase: new URL(DEFAULT_METADATA_BASE),
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    openGraph: {
      title: seoData.openGraph?.title || seoData.title,
      description: seoData.openGraph?.description || seoData.description,
      url: validOgUrl,
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
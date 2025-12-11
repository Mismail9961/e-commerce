import mongoose from "mongoose";

const openGraphSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    url: { type: String, default: "" },
    siteName: { type: String, default: "" },
    locale: { type: String, default: "en_US" },
    type: { type: String, default: "website" },
    image: { type: String, default: "" },
  },
  { _id: false }
);

const categorySeoSchema = new mongoose.Schema(
  {
    categorySlug: {
      type: String,
      required: true,
      unique: true,
      enum: [
        "gaming-consoles",
        "mobile-accessories",
        "playstation-games",
        "gaming-accessories",
      ],
    },
    categoryName: {
      type: String,
      required: true,
    },
    seo: {
      title: { type: String, required: true },
      description: { type: String, required: true },
      keywords: { type: [String], default: [] },
      openGraph: { type: openGraphSchema, default: {} },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
categorySeoSchema.index({ categorySlug: 1 });

export default mongoose.models.CategorySeo ||
  mongoose.model("CategorySeo", categorySeoSchema);

// Example: How to add multiple categories with different SEO content
/*
// Gaming Consoles SEO
await CategorySeo.create({
  categorySlug: "gaming-consoles",
  categoryName: "Gaming Consoles",
  seo: {
    title: "Gaming Consoles - PS5, Xbox, Nintendo | Your Store",
    description: "Shop the latest gaming consoles including PlayStation 5, Xbox Series X/S, and Nintendo Switch with competitive prices and fast shipping.",
    keywords: ["gaming consoles", "PS5", "Xbox Series X", "Nintendo Switch", "buy console"],
    openGraph: {
      title: "Premium Gaming Consoles Collection",
      description: "Get the latest PlayStation, Xbox, and Nintendo consoles",
      url: "https://yoursite.com/gaming-consoles",
      siteName: "Your Gaming Store",
      image: "https://yoursite.com/images/consoles-banner.jpg"
    }
  }
});

// PlayStation Games SEO
await CategorySeo.create({
  categorySlug: "playstation-games",
  categoryName: "PlayStation Games",
  seo: {
    title: "PlayStation Games - PS5 & PS4 Games | Your Store",
    description: "Explore our massive collection of PlayStation games for PS5 and PS4. From action-adventure to sports, find your next gaming obsession.",
    keywords: ["PlayStation games", "PS5 games", "PS4 games", "buy PS games", "gaming titles"],
    openGraph: {
      title: "PlayStation Games Library",
      description: "Discover thousands of PS5 and PS4 game titles",
      url: "https://yoursite.com/playstation-games",
      siteName: "Your Gaming Store",
      image: "https://yoursite.com/images/ps-games-banner.jpg"
    }
  }
});

// Mobile Accessories SEO
await CategorySeo.create({
  categorySlug: "mobile-accessories",
  categoryName: "Mobile Accessories",
  seo: {
    title: "Mobile Accessories - Cases, Chargers & More | Your Store",
    description: "Premium mobile accessories including phone cases, screen protectors, chargers, and gaming controllers for mobile devices.",
    keywords: ["mobile accessories", "phone cases", "mobile chargers", "screen protectors"],
    openGraph: {
      title: "Mobile Gaming Accessories",
      description: "Enhance your mobile gaming experience",
      url: "https://yoursite.com/mobile-accessories",
      siteName: "Your Gaming Store",
      image: "https://yoursite.com/images/mobile-acc-banner.jpg"
    }
  }
});

// Gaming Accessories SEO
await CategorySeo.create({
  categorySlug: "gaming-accessories",
  categoryName: "Gaming Accessories",
  seo: {
    title: "Gaming Accessories - Controllers, Headsets & More | Your Store",
    description: "Level up your gaming setup with premium accessories including controllers, gaming headsets, charging docks, and protective cases.",
    keywords: ["gaming accessories", "controllers", "gaming headsets", "charging docks"],
    openGraph: {
      title: "Premium Gaming Accessories",
      description: "Complete your gaming setup with quality accessories",
      url: "https://yoursite.com/gaming-accessories",
      siteName: "Your Gaming Store",
      image: "https://yoursite.com/images/gaming-acc-banner.jpg"
    }
  }
});

// Fetch specific category SEO
const gamingConsolesSeo = await CategorySeo.findOne({ categorySlug: "gaming-consoles" });
const psGamesSeo = await CategorySeo.findOne({ categorySlug: "playstation-games" });
*/
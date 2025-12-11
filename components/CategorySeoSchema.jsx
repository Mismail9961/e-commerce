// components/CategorySeoSchema.js
'use client'
import { useEffect } from 'react';

const CategorySeoSchema = ({ categoryName, categorySlug, products, categorySeo }) => {
  useEffect(() => {
    // Create structured data for the category page
    const schema = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": categoryName,
      "description": categorySeo?.seo?.description || `Browse ${categoryName} products`,
      "url": `${window.location.origin}/${categorySlug}`,
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": window.location.origin
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": categoryName,
            "item": `${window.location.origin}/${categorySlug}`
          }
        ]
      },
      "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": products.length,
        "itemListElement": products.slice(0, 12).map((product, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Product",
            "name": product.name,
            "description": product.description,
            "image": product.image,
            "offers": {
              "@type": "Offer",
              "price": product.price,
              "priceCurrency": "PKR",
              "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
            }
          }
        }))
      }
    };

    // Remove existing schema if present
    const existingScript = document.getElementById('category-schema');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new schema
    const script = document.createElement('script');
    script.id = 'category-schema';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);

    // Cleanup on unmount
    return () => {
      const scriptToRemove = document.getElementById('category-schema');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [categoryName, categorySlug, products, categorySeo]);

  return null;
};

export default CategorySeoSchema;
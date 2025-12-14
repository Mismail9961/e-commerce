"use client";
import { useState, useEffect } from "react";
import { 
  Save, RefreshCw, Globe, Tag,
  Facebook, Twitter, Instagram, Youtube, MessageCircle,
  Eye, EyeOff, Trash2
} from "lucide-react";

export default function ProductPagesSeoAdmin() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [seoData, setSeoData] = useState({
    title: "",
    description: "",
    keywords: [],
    canonicalUrl: "",
    openGraph: {
      title: "",
      description: "",
      url: "",
      siteName: "",
      locale: "en_US",
      type: "website",
      image: "",
    },
    structuredData: {
      organizationName: "",
      websiteName: "",
      defaultBrand: "",
      defaultCondition: "new",
      defaultAvailability: "in stock",
      defaultCurrency: "PKR",
      reviewCount: 0,
      averageRating: 4.5,
    },
    socialMedia: {
      facebook: "",
      twitter: "",
      instagram: "",
      youtube: "",
      tiktok: "",
    },
  });
  const [keywordInput, setKeywordInput] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchSeoData();
  }, []);

  const fetchSeoData = async () => {
    try {
      setFetching(true);
      const res = await fetch("/api/product-pages-seo");
      const data = await res.json();
      if (data.success) {
        setSeoData(data.data);
      }
    } catch (error) {
      setErrorMsg("Failed to load SEO settings");
      console.error(error);
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSeoData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (section, field, value) => {
    setSeoData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !seoData.keywords.includes(keywordInput.trim())) {
      setSeoData((prev) => ({
        ...prev,
        keywords: [...prev.keywords, keywordInput.trim()],
      }));
      setKeywordInput("");
    }
  };

  const removeKeyword = (i) => {
    setSeoData((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((_, idx) => idx !== i),
    }));
  };

  const handleSubmit = async () => {
    setSuccessMsg("");
    setErrorMsg("");

    if (!seoData.title || !seoData.description) {
      setErrorMsg("Title and description are required");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/product-pages-seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(seoData),
      });
      const data = await res.json();
      
      if (data.success) {
        setSuccessMsg("Product Pages SEO updated successfully!");
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setErrorMsg(data.error || "Failed to update");
      }
    } catch (error) {
      setErrorMsg("Failed to update SEO settings");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!confirm("Reset to default settings? This cannot be undone.")) return;
    
    try {
      setLoading(true);
      const res = await fetch("/api/product-pages-seo", { method: "DELETE" });
      const data = await res.json();
      
      if (data.success) {
        await fetchSeoData();
        setSuccessMsg("Settings reset to default");
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (error) {
      setErrorMsg("Failed to reset settings");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#003049]">
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-[#9d0208]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#003049] px-3 sm:px-6 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-4 sm:mb-8">
          <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">
            Product Pages SEO Settings
          </h1>
          <p className="text-xs sm:text-base text-gray-400">
            Configure SEO settings for all product pages
          </p>
        </div>

        {/* Alert Messages */}
        {successMsg && (
          <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-xs sm:text-base">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs sm:text-base">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-6">
            
            {/* Basic SEO */}
            <div className="bg-[#001f2f] border border-white/10 rounded-lg p-3 sm:p-6">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-[#9d0208]" />
                <h2 className="text-base sm:text-xl font-semibold text-white">Basic SEO</h2>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="text-xs sm:text-sm text-gray-300 block mb-1.5 sm:mb-2">Page Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={seoData.title}
                    onChange={handleChange}
                    className="w-full px-2.5 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm bg-[#003049] border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-[#9d0208] focus:border-transparent"
                    placeholder="Our Products | Gaming Hub"
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-sm text-gray-300 block mb-1.5 sm:mb-2">Meta Description *</label>
                  <textarea
                    name="description"
                    value={seoData.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-2.5 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm bg-[#003049] border border-white/20 rounded-lg text-white resize-none focus:ring-2 focus:ring-[#9d0208] focus:border-transparent"
                    placeholder="Browse our collection of gaming products..."
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-sm text-gray-300 block mb-1.5 sm:mb-2">Canonical URL</label>
                  <input
                    type="url"
                    name="canonicalUrl"
                    value={seoData.canonicalUrl}
                    onChange={handleChange}
                    className="w-full px-2.5 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm bg-[#003049] border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-[#9d0208] focus:border-transparent"
                    placeholder="https://yoursite.com/products"
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-sm text-gray-300 block mb-1.5 sm:mb-2">Keywords</label>
                  <div className="flex gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                    <input
                      type="text"
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                      className="flex-1 px-2.5 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm bg-[#003049] border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-[#9d0208] focus:border-transparent"
                      placeholder="Add keyword"
                    />
                    <button
                      type="button"
                      onClick={addKeyword}
                      className="px-3 sm:px-4 py-2 sm:py-2.5 bg-[#9d0208] text-white rounded-lg hover:bg-[#7a0207] text-xs sm:text-sm font-medium whitespace-nowrap"
                    >
                      Add
                    </button>
                  </div>

                  {seoData.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {seoData.keywords.map((k, i) => (
                        <span
                          key={i}
                          className="flex items-center gap-1.5 sm:gap-2 bg-[#9d0208]/20 border border-[#9d0208]/40 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs"
                        >
                          <span className="text-white">{k}</span>
                          <button onClick={() => removeKeyword(i)} className="text-base sm:text-lg leading-none hover:text-white text-gray-400">
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Structured Data */}
            <div className="bg-[#001f2f] border border-white/10 rounded-lg p-3 sm:p-6">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-[#9d0208]" />
                <h2 className="text-base sm:text-xl font-semibold text-white">Default Product Schema</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="text-[10px] sm:text-xs text-gray-400 block mb-1">Organization Name</label>
                  <input
                    type="text"
                    value={seoData.structuredData.organizationName}
                    onChange={(e) => handleNestedChange('structuredData', 'organizationName', e.target.value)}
                    className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-[#003049] border border-white/20 rounded-lg text-white"
                    placeholder="Gaming Hub"
                  />
                </div>

                <div>
                  <label className="text-[10px] sm:text-xs text-gray-400 block mb-1">Website Name</label>
                  <input
                    type="text"
                    value={seoData.structuredData.websiteName}
                    onChange={(e) => handleNestedChange('structuredData', 'websiteName', e.target.value)}
                    className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-[#003049] border border-white/20 rounded-lg text-white"
                    placeholder="7even86gamehub.com"
                  />
                </div>

                <div>
                  <label className="text-[10px] sm:text-xs text-gray-400 block mb-1">Default Brand</label>
                  <input
                    type="text"
                    value={seoData.structuredData.defaultBrand}
                    onChange={(e) => handleNestedChange('structuredData', 'defaultBrand', e.target.value)}
                    className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-[#003049] border border-white/20 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] sm:text-xs text-gray-400 block mb-1">Default Currency</label>
                  <input
                    type="text"
                    value={seoData.structuredData.defaultCurrency}
                    onChange={(e) => handleNestedChange('structuredData', 'defaultCurrency', e.target.value)}
                    className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-[#003049] border border-white/20 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] sm:text-xs text-gray-400 block mb-1">Condition</label>
                  <select
                    value={seoData.structuredData.defaultCondition}
                    onChange={(e) => handleNestedChange('structuredData', 'defaultCondition', e.target.value)}
                    className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-[#003049] border border-white/20 rounded-lg text-white"
                  >
                    <option value="new">New</option>
                    <option value="refurbished">Refurbished</option>
                    <option value="used">Used</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] sm:text-xs text-gray-400 block mb-1">Availability</label>
                  <select
                    value={seoData.structuredData.defaultAvailability}
                    onChange={(e) => handleNestedChange('structuredData', 'defaultAvailability', e.target.value)}
                    className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-[#003049] border border-white/20 rounded-lg text-white"
                  >
                    <option value="in stock">In Stock</option>
                    <option value="out of stock">Out of Stock</option>
                    <option value="preorder">Pre-order</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] sm:text-xs text-gray-400 block mb-1">Average Rating</label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={seoData.structuredData.averageRating}
                    onChange={(e) => handleNestedChange('structuredData', 'averageRating', parseFloat(e.target.value))}
                    className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-[#003049] border border-white/20 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] sm:text-xs text-gray-400 block mb-1">Review Count</label>
                  <input
                    type="number"
                    min="0"
                    value={seoData.structuredData.reviewCount}
                    onChange={(e) => handleNestedChange('structuredData', 'reviewCount', parseInt(e.target.value))}
                    className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-[#003049] border border-white/20 rounded-lg text-white"
                  />
                </div>
              </div>
            </div>

            {/* Open Graph */}
            <div className="bg-[#001f2f] border border-white/10 rounded-lg p-3 sm:p-6">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Facebook className="w-4 h-4 sm:w-5 sm:h-5 text-[#9d0208]" />
                <h2 className="text-base sm:text-xl font-semibold text-white">Open Graph</h2>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="text-[10px] sm:text-xs text-gray-400 block mb-1">OG Title</label>
                  <input
                    type="text"
                    value={seoData.openGraph.title}
                    onChange={(e) => handleNestedChange('openGraph', 'title', e.target.value)}
                    className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-[#003049] border border-white/20 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] sm:text-xs text-gray-400 block mb-1">OG Description</label>
                  <textarea
                    value={seoData.openGraph.description}
                    onChange={(e) => handleNestedChange('openGraph', 'description', e.target.value)}
                    rows="2"
                    className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-[#003049] border border-white/20 rounded-lg text-white resize-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] sm:text-xs text-gray-400 block mb-1">OG Image URL</label>
                  <input
                    type="url"
                    value={seoData.openGraph.image}
                    onChange={(e) => handleNestedChange('openGraph', 'image', e.target.value)}
                    className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-[#003049] border border-white/20 rounded-lg text-white"
                    placeholder="https://example.com/og-image.jpg"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="text-[10px] sm:text-xs text-gray-400 block mb-1">Site Name</label>
                    <input
                      type="text"
                      value={seoData.openGraph.siteName}
                      onChange={(e) => handleNestedChange('openGraph', 'siteName', e.target.value)}
                      className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-[#003049] border border-white/20 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] sm:text-xs text-gray-400 block mb-1">Locale</label>
                    <input
                      type="text"
                      value={seoData.openGraph.locale}
                      onChange={(e) => handleNestedChange('openGraph', 'locale', e.target.value)}
                      className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-[#003049] border border-white/20 rounded-lg text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-[#001f2f] border border-white/10 rounded-lg p-3 sm:p-6">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#9d0208]" />
                <h2 className="text-base sm:text-xl font-semibold text-white">Social Media Links</h2>
              </div>

              <div className="space-y-2.5 sm:space-y-3">
                {Object.entries(seoData.socialMedia).map(([platform, url]) => (
                  <div key={platform}>
                    <label className="text-[10px] sm:text-xs text-gray-400 block mb-1 capitalize">{platform}</label>
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => handleNestedChange('socialMedia', platform, e.target.value)}
                      className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-[#003049] border border-white/20 rounded-lg text-white"
                      placeholder={`https://${platform}.com/...`}
                    />
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-3 sm:space-y-6">
            
            {/* Preview Toggle */}
            <div className="bg-[#001f2f] border border-white/10 rounded-lg p-3 sm:p-4">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="w-full flex items-center justify-between text-white hover:text-[#9d0208] transition-colors"
              >
                <span className="text-xs sm:text-sm font-medium">Live Preview</span>
                {showPreview ? <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              </button>
            </div>

            {/* Preview */}
            {showPreview && (
              <div className="bg-[#001f2f] border border-white/10 rounded-lg p-3 sm:p-4">
                <h3 className="text-xs sm:text-sm font-semibold text-white mb-2 sm:mb-3">SEO Preview</h3>
                
                <div className="space-y-2 sm:space-y-3">
                  <div className="bg-[#003049] p-2 sm:p-3 rounded">
                    <p className="text-[10px] sm:text-xs text-gray-500 mb-1">Title Tag</p>
                    <p className="text-xs sm:text-sm text-white font-medium break-words">{seoData.title || "Not set"}</p>
                  </div>

                  <div className="bg-[#003049] p-2 sm:p-3 rounded">
                    <p className="text-[10px] sm:text-xs text-gray-500 mb-1">Description</p>
                    <p className="text-[10px] sm:text-xs text-gray-300 break-words">{seoData.description || "Not set"}</p>
                  </div>

                  <div className="bg-[#003049] p-2 sm:p-3 rounded">
                    <p className="text-[10px] sm:text-xs text-gray-500 mb-1.5 sm:mb-2">Keywords</p>
                    {seoData.keywords.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {seoData.keywords.map((k, i) => (
                          <span key={i} className="px-1.5 sm:px-2 py-0.5 bg-[#9d0208]/20 text-[9px] sm:text-[10px] text-gray-300 rounded">
                            {k}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10px] sm:text-xs text-gray-500">No keywords</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="bg-[#001f2f] border border-white/10 rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-[#9d0208] text-white rounded-lg hover:bg-[#7a0207] transition-colors disabled:opacity-50 text-xs sm:text-sm font-medium"
              >
                <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {loading ? "Saving..." : "Save Changes"}
              </button>

              <button
                onClick={fetchSeoData}
                disabled={loading}
                className="w-full flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50 text-xs sm:text-sm"
              >
                <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Refresh
              </button>

              <button
                onClick={handleReset}
                disabled={loading}
                className="w-full flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/10 transition-colors disabled:opacity-50 text-xs sm:text-sm"
              >
                <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Reset to Default
              </button>
            </div>

            {/* Info */}
            <div className="bg-[#9d0208]/10 border border-[#9d0208]/30 rounded-lg p-3 sm:p-4">
              <h3 className="text-xs sm:text-sm font-semibold text-white mb-1.5 sm:mb-2">Important</h3>
              <ul className="text-[10px] sm:text-xs text-gray-400 space-y-1 sm:space-y-1.5">
                <li>• Changes apply to all product pages</li>
                <li>• Individual product SEO can override defaults</li>
                <li>• Structured data improves search visibility</li>
                <li>• Always test changes before publishing</li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
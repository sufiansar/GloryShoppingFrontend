"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/modules/PublicProduct/ProductCard";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAllProducts } from "@/action/product/product.action";
import { getBrandBySlugWithProducts } from "@/action/brand/brand.action";

interface Brand {
  id: string;
  name: string;
  slug?: string;
  logoUrl?: string | null;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  discount?: number;
  thumbleImage?: string;
}

interface BrandPageClientProps {
  brands: Brand[];
  initialProducts: Product[];
}

export default function BrandPageClient({ brands, initialProducts }: BrandPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const brandSlug = searchParams.get("brand");

  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [products, setProducts] = useState<Product[]>(initialProducts || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!brandSlug || brands.length === 0) {
      setSelectedBrand(null);
      return;
    }

    const matchedBrand = brands.find(
      (brand) => (brand.slug || generateSlug(brand.name)) === brandSlug,
    );

    setSelectedBrand(matchedBrand || null);
  }, [brandSlug, brands]);

  // Fetch products for selected brand
  useEffect(() => {
    // Skip fetching on initial load if we already have initialProducts and no brand is selected
    if (!selectedBrand && initialProducts?.length > 0 && products === initialProducts) {
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        let result;
        if (selectedBrand) {
          const slug = selectedBrand.slug || generateSlug(selectedBrand.name);
          result = await getBrandBySlugWithProducts("page=1&limit=20", slug);
          // Try multiple common paths for brand-specific products
          const brandProducts = result?.data?.products || result?.data?.data?.products || result?.data || [];
          setProducts(Array.isArray(brandProducts) ? brandProducts : []);
        } else {
          result = await getAllProducts("page=1&limit=20&sortBy=createdAt&sortOrder=desc");
          // Try multiple common paths for global products
          const allProducts = result?.data?.data || result?.data || [];
          setProducts(Array.isArray(allProducts) ? allProducts : []);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedBrand]);

  // Removed scroll brand list logic as the slider was removed

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/\./g, "")
      .replace(/&/g, "and");
  };

  const handleBrandClick = (brand: Brand | null) => {
    setSelectedBrand(brand);
    if (brand) {
      const slug = brand.slug || generateSlug(brand.name);
      router.push(`/categorys/brand?brand=${slug}`, { scroll: false });
    } else {
      router.push("/categorys/brand", { scroll: false });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1600px] mx-auto px-2 md:px-4 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-[#ca428b] mb-4">
            Shop by Brand
          </h1>
          <p className="text-gray-600 text-lg">
            Browse products from your favorite brands below
          </p>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Brand Filter Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-lg shadow-md p-4 max-h-[calc(100vh-120px)] overflow-y-auto">
              <h2 className="text-sm font-semibold text-gray-900 mb-3">
                Brands
              </h2>
              <div className="space-y-1">
                <button
                  onClick={() => handleBrandClick(null)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm ${selectedBrand === null
                      ? "bg-[#ca428b] text-white font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  All Brands
                </button>
                {brands.map((brand) => (
                  <button
                    key={brand.id}
                    onClick={() => handleBrandClick(brand)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center gap-2 text-xs ${selectedBrand?.id === brand.id
                        ? "bg-[#ca428b] text-white font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    {brand.logoUrl && (
                      <img
                        src={brand.logoUrl}
                        alt={brand.name}
                        className="w-4 h-4 object-contain shrink-0"
                      />
                    )}
                    <span className="truncate">{brand.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-4">
            {/* Brand Header Card with Slider */}
            {selectedBrand && (
              <div className="mb-8 bg-white rounded-lg shadow-md p-8 border-l-4 border-[#ca428b] animate-in slide-in-from-right duration-500">
                <div className="flex items-center gap-6">
                  {selectedBrand.logoUrl ? (
                    <div className="w-24 h-24 shrink-0 flex items-center justify-center bg-[#ca428b]/10 rounded-lg">
                      <img
                        src={selectedBrand.logoUrl}
                        alt={selectedBrand.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 shrink-0 bg-[#ca428b]/10 rounded-lg flex items-center justify-center">
                      <span className="text-3xl font-bold text-[#ca428b]">
                        {selectedBrand.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      {selectedBrand.name}
                    </h2>
                    <p className="text-gray-600">
                      {products.length > 0
                        ? `${products.length} products available`
                        : "No products available"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Brand Slider Navigation Removed as per user request */}

            {/* Products Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ca428b]"></div>
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product as any} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <svg
                  className="w-16 h-16 text-gray-300 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Products Found
                </h3>
                <p className="text-gray-600">
                  {selectedBrand
                    ? `This brand doesn't have any products yet.`
                    : "No products available at the moment."}
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

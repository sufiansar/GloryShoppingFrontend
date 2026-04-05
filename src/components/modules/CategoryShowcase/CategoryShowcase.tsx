// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { ChevronRight } from "lucide-react";
// import { Category } from "@/types/categorys.interface";
// import { Product } from "@/types/product.interface";
// import { getAllProductByCategory } from "@/action/product/product.action";
// import ProductCard from "../PublicProduct/ProductCard";

// interface CategoryShowcaseProps {
//   category: Category;
// }

// export default async function CategoryShowcase({
//   category,
// }: CategoryShowcaseProps) {
//   try {
//     const result = await getAllProductByCategory("", category.id || "");

//     const products: Product[] = result?.data?.data || result?.data || [];

//     return (
//       <div className="space-y-6 mb-12">
//         {/* Category Header */}
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="text-2xl md:text-3xl font-bold text-gray-900 uppercase">
//               {category.name}
//             </h2>
//             {category.description && (
//               <p className="text-gray-600 mt-1 text-sm md:text-base">
//                 {category.description}
//               </p>
//             )}
//           </div>
//           <Link href={`/categorys/${category.slug}`}>
//             <Button
//               variant="outline"
//               className="gap-2 hover:bg-pink-600 hover:text-white transition-colors"
//             >
//               See More
//               <ChevronRight className="h-4 w-4" />
//             </Button>
//           </Link>
//         </div>

//         {/* Products Grid or Empty State */}
//         {products.length > 0 ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
//             {products.map((product) => (
//               <ProductCard key={product.id} product={product} />
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-12 bg-gray-50 rounded-lg">
//             <p className="text-gray-600">
//               No products available in this category yet
//             </p>
//           </div>
//         )}

//         {/* Divider */}
//         <div className="border-b border-gray-200 mt-8"></div>
//       </div>
//     );
//   } catch (error) {
//     console.error(`Error in CategoryShowcase for ${category.name}:`, error);
//     // Still show the category header even if there's an error
//     return (
//       <div className="space-y-6 mb-12">
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="text-2xl md:text-3xl font-bold text-gray-900 uppercase">
//               {category.name}
//             </h2>
//             {category.description && (
//               <p className="text-gray-600 mt-1 text-sm md:text-base">
//                 {category.description}
//               </p>
//             )}
//           </div>
//           <Link href={`/categorys/${category.slug}`}>
//             <Button
//               variant="outline"
//               className="gap-2 hover:bg-pink-600 hover:text-white transition-colors"
//             >
//               See More
//               <ChevronRight className="h-4 w-4" />
//             </Button>
//           </Link>
//         </div>
//         <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200">
//           <p className="text-red-600">Error loading products</p>
//         </div>
//         <div className="border-b border-gray-200 mt-8"></div>
//       </div>
//     );
//   }
// }

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Category } from "@/types/categorys.interface";
import { Product } from "@/types/product.interface";
import { getAllProductByCategory } from "@/action/product/product.action";
import ProductCard from "../PublicProduct/ProductCard";
import { useState, useEffect, useRef } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

interface CategoryShowcaseProps {
  category: Category;
  limit?: number;
  title?: string;
  isSubCategory?: boolean;
  initialProducts?: Product[];
}

export default function CategoryShowcase({
  category,
  limit = 10,
  title,
  isSubCategory = false,
  initialProducts,
}: CategoryShowcaseProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts || []);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(!initialProducts);
  const timer = useRef<any>(null);

  useEffect(() => {
    if (initialProducts) {
      setProducts(initialProducts);
      setIsLoading(false);
      return;
    }
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const result = await getAllProductByCategory(
          `limit=${limit}`,
          category.id || "",
        );
        setProducts(result?.data?.data || result?.data || []);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setError(true);
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [category.id, limit, initialProducts]);

  if (isSubCategory && !isLoading && products.length === 0) {
    return null;
  }


  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    slides: {
      perView: 4,
      spacing: 15,
    },
    breakpoints: {
      "(max-width: 1024px)": { slides: { perView: 3, spacing: 10 } },
      "(max-width: 768px)": { slides: { perView: 2, spacing: 10 } },
      "(max-width: 480px)": { slides: { perView: 1, spacing: 5 } },
    },
    loop: true,
    created(s) {
      startAutoplay(s);
      if (s.container) {
        s.container.addEventListener("mouseover", stopAutoplay);
        s.container.addEventListener("mouseout", () => startAutoplay(s));
      }
    },
    drag: true, // swipe support
    rubberband: true, // smooth edge swipe effect
  });

  const startAutoplay = (s: any) => {
    stopAutoplay();
    timer.current = setInterval(() => {
      s.next();
    }, 3000); // 3 sec por slide move
  };

  const stopAutoplay = () => {
    if (timer.current) clearInterval(timer.current);
  };

  return (
    <div
      className={`space-y-4 ${
        isSubCategory ? "mb-6" : "mb-12 border-b border-gray-100 pb-8 last:border-b-0"
      }`}
    >
      {/* Category Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2
            className={`${
              isSubCategory ? "text-lg font-bold text-pink-600" : "text-2xl md:text-3xl font-bold text-gray-900"
            } uppercase`}
          >
            {title || category.name}
          </h2>
          {category.description && !isSubCategory && (
            <p className="text-gray-600 mt-1 text-sm md:text-base">
              {category.description}
            </p>
          )}
        </div>
        {!isSubCategory && (
          <Link href={`/categorys/${category.slug}`}>
            <Button
              variant="outline"
              className="gap-2 border border-pink-500 text-pink-500 transition-colors"
            >
              See More
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>

      {/* Products Slider */}
      {error ? (
        !isSubCategory && (
          <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200">
            <p className="text-red-600">Error loading products</p>
          </div>
        )
      ) : products.length > 0 ? (
        <div ref={sliderRef} className="keen-slider cursor-grab">
          {products.map((product) => (
            <div key={product.id} className="keen-slider__slide">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        !isSubCategory && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600">
              No products available in this category yet
            </p>
          </div>
        )
      )}
    </div>
  );
}

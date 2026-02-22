"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Product } from "@/types/product.interface";
import { bestProucts } from "@/action/stats/stats.action";
import ProductCard from "./ProductCard";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { getAllProducts } from "@/action/product/product.action";

export default function BestProductSlider() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState(false);
  const timer = useRef<any>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await getAllProducts("");
        setProducts(result?.data || []);
      } catch {
        setError(true);
      }
    };
    fetchProducts();
  }, []);

  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 4, spacing: 15 },
    breakpoints: {
      "(max-width: 1024px)": { slides: { perView: 3 } },
      "(max-width: 768px)": { slides: { perView: 2 } },
      "(max-width: 480px)": { slides: { perView: 1 } },
    },
    created(s) {
      startAutoPlay(s);
      s.container.addEventListener("mouseenter", stopAutoPlay);
      s.container.addEventListener("mouseleave", () => startAutoPlay(s));
    },
  });

  const startAutoPlay = (s: any) => {
    stopAutoPlay();
    timer.current = setInterval(() => s.next(), 3000);
  };

  const stopAutoPlay = () => {
    if (timer.current) clearInterval(timer.current);
  };

  return (
    <section className="space-y-6 mb-12">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl md:text-3xl font-bold uppercase">
          New Arrivals
        </h2>

        <Link className="text-pink-500 border-pink-500" href="/products">
          <Button variant="outline" className="gap-2 ">
            See More <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {error ? (
        <p className="text-red-600 text-center">Failed to load products</p>
      ) : products.length > 0 ? (
        <div ref={sliderRef} className="keen-slider">
          {products.map((product) => (
            <div key={product.id} className="keen-slider__slide">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No products found</p>
      )}
    </section>
  );
}

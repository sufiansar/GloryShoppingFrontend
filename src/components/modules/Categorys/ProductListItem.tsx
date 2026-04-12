import { Product } from "@/types/product.interface";
import { useRouter } from "next/navigation";

export function ProductListItem({ product }: { product: Product }) {
  const router = useRouter();

  const originalPrice =
    product.price && product.discount
      ? product.price * (1 + product.discount / 100)
      : product.price;

  return (
    <div
      className="bg-white rounded-xl border overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => router.push(`/product/${product.slug || product.id}`)}
    >
      <div className="flex flex-col md:flex-row">
        <div className="md:w-48 lg:w-64 h-48 md:h-auto bg-gray-100 relative">
          {product.thumbleImage ? (
            <img
              src={product.thumbleImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
          {product.discount && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
              {product.discount}% OFF
            </div>
          )}
        </div>

        <div className="flex-1 p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 hover:text-primary transition-colors">
                {product.name}
              </h3>
              <div className="flex items-center gap-2 mt-2">
                {product?.brand?.name && (
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                    {product.brand.name}
                  </span>
                )}
              </div>
            </div>

            <div className="text-right">
              <div className="text-xl font-bold text-primary">
                ৳{product.price?.toFixed(0) || "0"}
              </div>
              {originalPrice && originalPrice > (product.price || 0) && (
                <div className="text-sm text-gray-500 line-through">
                  ৳{originalPrice.toFixed(0)}
                </div>
              )}
            </div>
          </div>

          <div className="mt-4">
            {product.shortDesc && (
              <p className="text-gray-600 line-clamp-2">{product.shortDesc}</p>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="flex items-center gap-0.5 bg-primary text-white px-2 py-1 rounded text-sm">
                  <span>★</span>
                  <span>
                    {product?.reviews && product.reviews.length > 0
                      ? (
                        product.reviews.reduce(
                          (sum, r) => sum + r.rating,
                          0,
                        ) / product.reviews.length
                      ).toFixed(1)
                      : "0"}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  ({product?.reviewCount || 0} reviews)
                </span>
              </div>

              <div className="text-sm text-gray-500">
                {product.stock === 0 ? (
                  <span className="text-red-500">Out of Stock</span>
                ) : product.stock && product.stock < 10 ? (
                  <span className="text-orange-500">
                    Only {product.stock} left
                  </span>
                ) : (
                  <span className="text-green-500">In Stock</span>
                )}
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                // Add to cart functionality here
              }}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              disabled={product.stock === 0}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

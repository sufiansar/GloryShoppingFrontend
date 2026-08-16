"use client";

type ProductStat = { productName?: string; totalSold?: number };

export default function BestProductsChart({
 data,
}: {
 data?: ProductStat[] | null;
}) {
 const list = data ?? [];

 const products = list?.slice(0, 5).map((product: any) => ({
 name: product.productName,
 sales: product.totalSold ?? 0,
 }));

 return (
 <div className="space-y-4">
 {products.length === 0 ? (
 <div className="text-center py-8 text-gray-500">
 No product data available
 </div>
 ) : (
 products.map((product, index) => (
 <div key={index} className="flex items-center gap-4">
 <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-linear-to-br from-pink-50 to-pink-100 flex items-center justify-center shrink-0">
 <img
 src={`https://via.placeholder.com/48x48/c25891/ffffff?text=${product.name?.charAt(0)}`}
 alt={product.name ||"Product"}
 className="w-full h-full object-cover"
 onError={(e) => {
 e.currentTarget.style.display ="none";
 }}
 />
 <span className="text-primary-custom font-bold text-lg">
 {product.name?.charAt(0)}
 </span>
 </div>

 <div className="flex-1 min-w-0">
 <div className="flex items-center justify-between mb-1">
 <h4 className="text-sm font-semibold text-gray-900 truncate">
 {product.name}
 </h4>
 <span className="text-xs font-bold text-gray-900 ml-2">
 ${product.sales}
 </span>
 </div>
 <div className="flex items-center gap-2">
 <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
 <div
 className="h-full bg-primary-custom rounded-full transition-all duration-500"
 style={{
 width: `${Math.min((product.sales / Math.max(...products.map((p) => p.sales))) * 100, 100)}%`,
 }}
 />
 </div>
 <div className="flex items-center gap-1">
 {Array.from({ length: 5 }).map((_, i) => (
 <svg
 key={i}
 className={`w-3 h-3 ${i < 4 ?"text-yellow-400":"text-gray-300"}`}
 fill="currentColor"
 viewBox="0 0 20 20"
 >
 <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
 </svg>
 ))}
 </div>
 </div>
 </div>
 </div>
 ))
 )}
 </div>
 );
}

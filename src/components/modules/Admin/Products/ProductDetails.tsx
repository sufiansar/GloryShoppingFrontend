"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import Image from "next/image";
import {
  Package,
  Tag,
  DollarSign,
  Percent,
  Box,
  FileText,
  Star,
  TrendingUp,
  Award,
  Eye,
  Calendar,
  Building2,
  Folder,
} from "lucide-react";
import { Product } from "@/types/product.interface";

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const originalPrice =
    product.price && product.discount
      ? product.price * (1 + product.discount / 100)
      : product.price;

  return (
    <div className="space-y-6">
      {/* Header with Image and Basic Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Image */}
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="aspect-square relative rounded-lg overflow-hidden border">
              {product.thumbleImage ? (
                <Image
                  src={product.thumbleImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <Package className="h-24 w-24 text-gray-400" />
                </div>
              )}
            </div>

            {/* Flags Badges */}
            <div className="flex flex-wrap gap-2 mt-4">
              {product.isNew && <Badge variant="secondary">New</Badge>}
              {product.isFeatured && (
                <Badge variant="secondary">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
              {product.isTrending && (
                <Badge variant="secondary">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Trending
                </Badge>
              )}
              {product.isBestSeller && (
                <Badge variant="secondary">
                  <Award className="h-3 w-3 mr-1" />
                  Best Seller
                </Badge>
              )}
              <Badge
                variant={product.isActive ? "default" : "secondary"}
                className={
                  product.isActive
                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                }
              >
                {product.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card className="lg:col-span-2">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold">{product.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="outline" className="font-mono">
                    {product.slug || "N/A"}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    <span>Brand</span>
                  </div>
                  <Badge variant="outline">Brand-{product.brandId}</Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Folder className="h-4 w-4" />
                    <span>Category</span>
                  </div>
                  <Badge variant="outline">Category-{product.categoryId}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span>Price</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">
                      ${product.price?.toFixed(2) || "0.00"}
                    </span>
                    {product.discount && product.discount > 0 && (
                      <>
                        <span className="text-lg text-red-600 line-through">
                          ${originalPrice?.toFixed(2)}
                        </span>
                        <Badge variant="destructive">
                          <Percent className="h-3 w-3 mr-1" />
                          {product.discount}% OFF
                        </Badge>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Box className="h-4 w-4" />
                    <span>Stock</span>
                  </div>
                  <Badge
                    variant={
                      product.stock === 0
                        ? "destructive"
                        : product.stock && product.stock < 10
                          ? "secondary"
                          : "default"
                    }
                    className="text-lg px-4 py-2"
                  >
                    {product.stock || 0} units
                  </Badge>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>Created</span>
                </div>
                <p>{new Date(product?.createdAt || "").toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Description and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Short Description */}
        {product.shortDesc && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Short Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{product.shortDesc}</p>
            </CardContent>
          </Card>
        )}

        {/* Long Description */}
        {product.description && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Long Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap">{product.description}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Full Description */}
        {product.description && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Full Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap">{product.description}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* FAQ Questions */}
        {/* {product. && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(() => {
                  try {
                    const faqs = JSON.parse(product.faquestions);
                    if (Array.isArray(faqs)) {
                      return faqs.map((faq: any, index: number) => (
                        <div key={index} className="border rounded-lg p-4">
                          <h4 className="font-medium mb-2">{faq.question}</h4>
                          <p className="text-muted-foreground">{faq.answer}</p>
                        </div>
                      ));
                    }
                  } catch (error) {
                    return (
                      <div className="border rounded-lg p-4">
                        <p className="text-muted-foreground">
                          {product.faquestions}
                        </p>
                      </div>
                    );
                  }
                })()}
              </div>
            </CardContent>
          </Card>
        )} */}
      </div>
    </div>
  );
}

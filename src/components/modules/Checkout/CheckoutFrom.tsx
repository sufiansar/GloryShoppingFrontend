// components/checkout/CheckoutForm.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createOrder } from "@/action/order/order.action";
import { getShippingConfigs } from "@/action/shipping/shipping.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  ShoppingCart,
  Package,
  CreditCard,
  Truck,
  MapPin,
  Home,
  Phone,
  Mail,
  User,
  ShieldCheck,
  Lock,
  CheckCircle,
  Clock,
  ArrowLeft,
} from "lucide-react";
import {
  CheckoutInput,
  DeliveryInput,
  ICartItem,
} from "@/types/checkout.interface";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Delivery charge constants (Fallbacks)
const DEFAULT_DELIVERY_CHARGES = {
  INSIDE_DHAKA: 60,
  OUTSIDE_DHAKA: 120,
} as const;

// Form validation schema
const formSchema = z.object({
  checkoutType: z.enum(["CART", "DIRECT"]),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  email: z
    .string()
    .email("Please enter a valid email")
    .optional()
    .or(z.literal("")),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  deliveryZone: z.enum(["INSIDE_DHAKA", "OUTSIDE_DHAKA"]),
  // Direct checkout fields
  variantId: z.string().optional(),
  quantity: z.number().min(1).optional(),
});

interface CheckoutFormProps {
  cartItems: ICartItem[];
  cartItemIds?: string[];
  userId?: string;
  availableVariants?: Array<{
    id: string;
    name: string;
    price: number;
    productName: string;
    stock: number;
  }>;
  onOrderSuccess?: (order: any) => void;
  initialCheckoutType?: "CART" | "DIRECT";
  directVariantId?: string;
  directQuantity?: number;
}

export function CheckoutForm({
  cartItems,
  cartItemIds,
  userId,
  availableVariants = [],
  onOrderSuccess,
  initialCheckoutType,
  directVariantId,
  directQuantity: initialDirectQuantity = 1,
}: CheckoutFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<string>(
    directVariantId || "",
  );
  const [directQuantity, setDirectQuantity] = useState(initialDirectQuantity);
  const [shippingConfigs, setShippingConfigs] = useState<any[]>([]);

  // Fetch shipping configurations
  useEffect(() => {
    const fetchShipping = async () => {
      const result = await getShippingConfigs();
      if (result.success && result.data && result.data.length > 0) {
        setShippingConfigs(result.data);
      }
    };
    fetchShipping();
  }, []);

  const baseColor = "oklch(52.801% 0.15987 344.323)";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      checkoutType:
        initialCheckoutType || (cartItems.length > 0 ? "CART" : "DIRECT"),
      name: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      postalCode: "",
      deliveryZone: "INSIDE_DHAKA",
      quantity: initialDirectQuantity,
    },
  });

  const watchCheckoutType = form.watch("checkoutType");
  const watchDeliveryZone = form.watch("deliveryZone");

  // Get delivery charge based on zone from API, fallback to defaults
  const deliveryCharge = React.useMemo(() => {
    if (shippingConfigs.length > 0) {
      const config = shippingConfigs.find(c => c.zoneName === watchDeliveryZone);
      if (config) return config.charge;
    }
    return DEFAULT_DELIVERY_CHARGES[watchDeliveryZone];
  }, [shippingConfigs, watchDeliveryZone]);

  // Calculate totals based on checkout type
  const calculateTotals = () => {
    if (watchCheckoutType === "CART") {
      const productTotal = cartItems.reduce(
        (sum, item) => sum + (item.price || 0) * item.quantity,
        0,
      );
      return {
        productTotal,
        deliveryCharge,
        grandTotal: productTotal + deliveryCharge,
      };
    } else {
      // Direct checkout
      const variant = availableVariants.find((v) => v.id === selectedVariant);
      const productTotal = variant ? variant.price * directQuantity : 0;
      return {
        productTotal,
        deliveryCharge,
        grandTotal: productTotal + deliveryCharge,
      };
    }
  };

  const { productTotal, grandTotal } = calculateTotals();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Validate based on checkout type
    if (watchCheckoutType === "CART" && cartItems.length === 0) {
      toast("Your cart is empty. Please add items to proceed.");
      return;
    }

    if (watchCheckoutType === "DIRECT") {
      if (!selectedVariant) {
        toast("Please select a product variant for direct purchase.");
        return;
      }
      if (directQuantity < 1) {
        toast("Please enter a valid quantity for direct purchase.");
        return;
      }
    }

    setIsLoading(true);

    try {
      // Prepare delivery data
      const deliveryData: DeliveryInput = {
        name: values.name,
        phone: values.phone,
        email: values?.email || "example@example.com",
        address: values.address,
        city: values?.city || "",
        postalCode: values.postalCode || "",
        deliveryCharge,
        deliveryZone: values.deliveryZone,
      };

      // Prepare checkout input based on type
      const checkoutInput: CheckoutInput = {
        type: watchCheckoutType,
        delivery: deliveryData,
      };

      if (watchCheckoutType === "CART" && cartItemIds) {
        checkoutInput.cartItemIds = cartItemIds;
      } else if (watchCheckoutType === "DIRECT") {
        checkoutInput.variantId = selectedVariant;
        checkoutInput.quantity = directQuantity;
      }

      // Call your API client function
      const result = await createOrder(checkoutInput);

      if (!result?.data) {
        if (result?.message?.includes("Cart items not found") || result?.message?.includes("not found")) {
          toast.error("Your cart is out of sync or items were already ordered. Refreshing your cart...");
          setTimeout(() => {
            window.location.href = "/product";
          }, 2000);
          return;
        }
        throw new Error(result?.message || "Failed to create order");
      }

      const order = result.data;

      toast("Order Created Successfully!", {
        description: `Order ID: ${order.id}`,
      });

      toast("Your order has been successfully placed!", {
        description: `Order #${order.id} - Total: ৳${order.amount?.toFixed(2) || grandTotal.toFixed(2)}`,
      });

      if (onOrderSuccess) {
        onOrderSuccess(order);
      }
    } catch (error) {
      console.error("Order creation error:", error);
      toast("Failed to create order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        id="checkout-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="min-h-screen py-8 px-4 bg-slate-50/50"
      >
        <div className="max-w-7xl mx-auto">
          {/* Back to Home Indicator */}
          <div className="mb-8">
            <a
              href="/"
              className="group inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 border border-slate-200"
              style={{
                boxShadow: `0 4px 12px ${baseColor}20`,
              }}
            >
              <Home
                className="w-4 h-4 transition-transform group-hover:-translate-x-1"
                style={{ color: baseColor }}
                strokeWidth={2}
              />
              <span className="text-sm font-medium text-slate-700">
                Back to Home
              </span>
            </a>
          </div>

          <div className="mb-10 text-center max-w-2xl mx-auto">
            <h1
              className="text-4xl md:text-5xl font-black mb-3 tracking-tighter"
              style={{ color: baseColor }}
            >
              Complete Your Order
            </h1>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest leading-relaxed">
              Finalize your purchase with our secure checkout
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Checkout Type Selector - Only show if both modes are available */}
              {cartItems.length > 0 && availableVariants.length === 0 && (
                <Card className="shadow-xs border-slate-100 bg-white overflow-hidden rounded-3xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-sm font-black uppercase tracking-widest" style={{ color: baseColor }}>
                      Checkout Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="checkoutType"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="CART" id="cart" />
                                <Label
                                  htmlFor="cart"
                                  className="cursor-pointer"
                                >
                                  <div className="flex items-center gap-2">
                                    <ShoppingCart
                                      className="h-4 w-4"
                                      style={{ color: baseColor }}
                                    />
                                    <span>Checkout from Cart</span>
                                    {cartItems.length > 0 && (
                                      <Badge variant="secondary">
                                        {cartItems.length} items
                                      </Badge>
                                    )}
                                  </div>
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="DIRECT" id="direct" />
                                <Label
                                  htmlFor="direct"
                                  className="cursor-pointer"
                                >
                                  <div className="flex items-center gap-2">
                                    <Package
                                      className="h-4 w-4"
                                      style={{ color: baseColor }}
                                    />
                                    <span>Direct Purchase</span>
                                  </div>
                                </Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Product Selection for Direct Checkout */}
              {watchCheckoutType === "DIRECT" &&
                availableVariants.length > 0 && (
                  <Card className="shadow-xs border-slate-100 bg-white overflow-hidden rounded-3xl">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-sm font-black uppercase tracking-widest" style={{ color: baseColor }}>
                        Product Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {availableVariants.length === 1 ? (
                        // Single variant - show as display only
                        <div
                          className="p-6 rounded-2xl bg-white border border-slate-100"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 inline-block">Direct Purchase</span>
                              <h3
                                className="font-black text-2xl tracking-tighter"
                                style={{ color: baseColor }}
                              >
                                {availableVariants[0].productName}
                              </h3>
                              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                SKU: {availableVariants[0].name}
                              </p>
                            </div>
                            <div className="text-right">
                              <p
                                className="text-3xl font-black tracking-tighter"
                                style={{ color: baseColor }}
                              >
                                ৳{availableVariants[0].price}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        // Multiple variants - show selector
                        <div>
                          <Label htmlFor="variant-select">
                            Product Variant
                          </Label>
                          <Select
                            value={selectedVariant}
                            onValueChange={setSelectedVariant}
                          >
                            <SelectTrigger id="variant-select">
                              <SelectValue placeholder="Select a product variant" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableVariants.map((variant) => (
                                <SelectItem key={variant.id} value={variant.id}>
                                  <div className="flex justify-between items-center w-full">
                                    <span>
                                      {variant.productName} - {variant.name}
                                    </span>
                                    <span className="text-slate-500">
                                      ৳{variant.price}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {selectedVariant && (
                        <div>
                          <Label htmlFor="quantity">Quantity</Label>
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/50 border border-white shadow-sm mt-4">
                          <Label htmlFor="quantity" className="text-xs font-black uppercase tracking-widest text-slate-500">Order Quantity</Label>
                          <div className="flex items-center gap-4">
                            <Button
                              type="button"
                              className="w-10 h-10 rounded-xl border-slate-100 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                setDirectQuantity(
                                  Math.max(1, directQuantity - 1),
                                )
                              }
                              disabled={directQuantity <= 1}
                            >
                              -
                            </Button>
                            <span className="text-lg font-black w-8 text-center" style={{ color: baseColor }}>{directQuantity}</span>
                            <Button
                              type="button"
                              className="w-10 h-10 rounded-xl border-slate-100 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                setDirectQuantity(directQuantity + 1)
                              }
                            >
                              +
                            </Button>
                          </div>
                        </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

              {/* Cart Items Display for Cart Checkout */}
              {watchCheckoutType === "CART" && cartItems.length > 0 && (
                <Card className="shadow-xs border-slate-100 bg-white overflow-hidden rounded-3xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-sm font-black uppercase tracking-widest" style={{ color: baseColor }}>
                      Cart Items
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {cartItems.map((item, index) => (
                        <div
                          key={item.variantId || index}
                          className="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-100"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center font-black text-slate-300 text-xs">
                              {index + 1}
                            </div>
                            <div>
                              <p
                                className="font-black text-lg tracking-tight"
                                style={{ color: baseColor }}
                              >
                                {item.productName || "Product"}
                              </p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                Qty: {item.quantity} × ৳{item.price?.toFixed(2)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p
                              className="font-black text-xl tracking-tighter"
                              style={{ color: baseColor }}
                            >
                              ৳{((item.price || 0) * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Delivery Zone Selection */}
              <Card className="shadow-xs border-slate-100 bg-white overflow-hidden rounded-3xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-sm font-black uppercase tracking-widest" style={{ color: baseColor }}>
                    Delivery Zone
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="deliveryZone"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent cursor-pointer">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="INSIDE_DHAKA"
                                  id="inside-dhaka"
                                />
                                  <Label
                                    htmlFor="inside-dhaka"
                                    className="cursor-pointer"
                                  >
                                    <div>
                                      <p className="font-medium">
                                        {shippingConfigs.find(c => c.zoneName === "INSIDE_DHAKA")?.description || "Inside Dhaka"}
                                      </p>
                                      <p className="text-sm text-slate-500">
                                        {shippingConfigs.find(c => c.zoneName === "INSIDE_DHAKA")?.description ? "Dhaka City Corporation areas" : "Dhaka City Corporation areas"}
                                      </p>
                                    </div>
                                  </Label>
                                </div>
                                <div className="text-right">
                                  <p
                                    className="font-semibold"
                                    style={{ color: baseColor }}
                                  >
                                    ৳{shippingConfigs.find(c => c.zoneName === "INSIDE_DHAKA")?.charge ?? DEFAULT_DELIVERY_CHARGES.INSIDE_DHAKA}
                                  </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent cursor-pointer">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="OUTSIDE_DHAKA"
                                  id="outside-dhaka"
                                />
                                  <Label
                                    htmlFor="outside-dhaka"
                                    className="cursor-pointer"
                                  >
                                    <div>
                                      <p className="font-medium">
                                        {shippingConfigs.find(c => c.zoneName === "OUTSIDE_DHAKA")?.description || "Outside Dhaka"}
                                      </p>
                                      <p className="text-sm text-slate-500">
                                        {shippingConfigs.find(c => c.zoneName === "OUTSIDE_DHAKA")?.description ? "Other cities and districts" : "Other cities and districts"}
                                      </p>
                                    </div>
                                  </Label>
                                </div>
                                <div className="text-right">
                                  <p
                                    className="font-semibold"
                                    style={{ color: baseColor }}
                                  >
                                    ৳{shippingConfigs.find(c => c.zoneName === "OUTSIDE_DHAKA")?.charge ?? DEFAULT_DELIVERY_CHARGES.OUTSIDE_DHAKA}
                                  </p>
                                </div>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Delivery Information Form */}
               <Card className="shadow-xs border-slate-100 bg-white overflow-hidden rounded-3xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-sm font-black uppercase tracking-widest" style={{ color: baseColor }}>
                    Shipping Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                              <Input
                                placeholder="John Doe"
                                className="pl-9"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                              <Input
                                placeholder="017XXXXXXXX"
                                className="pl-9"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Email Address{" "}
                          <span className="text-slate-400 text-xs font-normal">
                            (Optional)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <Input
                              type="email"
                              placeholder="john@example.com"
                              className="pl-9"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Delivery Address *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Home className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
                            <Textarea
                              placeholder="123 Main St, Apt 4B"
                              className="min-h-20 pl-9"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="Dhaka" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Postal Code{" "}
                            <span className="text-slate-400 text-xs font-normal">
                              (Optional)
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="1212" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div className="space-y-6">
              <Card className="shadow-xs border-slate-100 bg-white overflow-hidden rounded-3xl sticky top-6">
                <CardHeader className="pb-6">
                  <CardTitle className="text-sm font-black uppercase tracking-widest" style={{ color: baseColor }}>
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Items Summary */}
                  <div>
                    <h3 className="font-semibold mb-2">
                      {watchCheckoutType === "CART"
                        ? `Items (${cartItems.length})`
                        : "Item Details"}
                    </h3>
                    <div className="space-y-2">
                      {watchCheckoutType === "CART"
                        ? cartItems.map((item, index) => (
                            <div
                              key={index}
                              className="flex justify-between text-sm"
                            >
                              <span className="truncate max-w-37.5">
                                {item.productName || "Product"}
                                <span className="text-slate-500 ml-1">
                                  ×{item.quantity}
                                </span>
                              </span>
                              <span>
                                ৳
                                {((item.price || 0) * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))
                        : selectedVariant && (
                            <div className="flex justify-between text-sm">
                              <span>
                                {
                                  availableVariants.find(
                                    (v) => v.id === selectedVariant,
                                  )?.productName
                                }
                                <span className="text-slate-500 ml-1">
                                  ×{directQuantity}
                                </span>
                              </span>
                              <span>৳{productTotal.toFixed(2)}</span>
                            </div>
                          )}
                    </div>
                  </div>

                  <div className="py-2 border-t border-dashed border-slate-200" />

                  {/* Pricing Breakdown */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm font-bold text-slate-500 uppercase tracking-widest">
                      <span>Subtotal</span>
                      <span className="text-slate-900 font-black">৳{productTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Shipping</span>
                        <span className="text-[11px] font-bold text-slate-600">
                          {watchDeliveryZone === "INSIDE_DHAKA"
                            ? "Inside Dhaka delivery"
                            : "Outside Dhaka delivery"}
                        </span>
                      </div>
                      <span className="text-slate-900 font-black">৳{deliveryCharge.toFixed(2)}</span>
                    </div>
                    
                    <div className="py-2 border-t border-dashed border-slate-200" />
                    
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-end">
                        <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Total Amount</span>
                        <span 
                          className="text-4xl font-black tracking-tighter"
                          style={{ 
                            background: `linear-gradient(135deg, ${baseColor}, #db2777)`,
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text"
                          }}
                        >
                          ৳{grandTotal.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right">Inclusive of all taxes</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                    <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase tracking-wider">
                      Secured by SSL Encryption. Your order is safe with us.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="pt-6">
                  <Button
                    type="submit"
                    form="checkout-form"
                    className="w-full shadow-lg hover:shadow-xl transition-all duration-300"
                    size="lg"
                    style={{
                      background: `linear-gradient(135deg, ${baseColor}, #db2777)`,
                    }}
                    disabled={
                      isLoading ||
                      (watchCheckoutType === "CART" &&
                        cartItems.length === 0) ||
                      (watchCheckoutType === "DIRECT" && !selectedVariant)
                    }
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing Your Order...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-5 w-5" />
                        Place Order - ৳{grandTotal.toFixed(2)}
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>

              {/* Delivery Info Card */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur overflow-hidden">
                <div
                  className="h-2 w-full"
                  style={{
                    background: `linear-gradient(90deg, ${baseColor}, #db2777)`,
                  }}
                />
                <CardHeader>
                  <CardTitle
                    className="flex items-center gap-2"
                    style={{ color: baseColor }}
                  >
                    <Truck className="h-5 w-5" />
                    Delivery Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Zone</span>
                    <span>
                      {watchDeliveryZone === "INSIDE_DHAKA"
                        ? "Inside Dhaka"
                        : "Outside Dhaka"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Charge</span>
                    <span>৳{deliveryCharge.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Estimated Time</span>
                    <span>
                      {watchDeliveryZone === "INSIDE_DHAKA"
                        ? "1-2 business days"
                        : "3-5 business days"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tracking</span>
                    <span>Available after shipping</span>
                  </div>
                </CardContent>
              </Card>
              {/* Trust & Benefits Grid */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: ShieldCheck, title: "100% Authentic" },
                  { icon: Lock, title: "Secure Payment" },
                  { icon: Clock, title: "Fast Delivery" },
                  { icon: CheckCircle, title: "Expert Support" }
                ].map((item, idx) => (
                  <div 
                    key={idx} 
                    className="p-4 rounded-2xl bg-white border border-slate-100 flex flex-col items-center text-center gap-2 group transition-all hover:bg-slate-50"
                  >
                    <item.icon className="w-5 h-5" style={{ color: baseColor }} />
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-600 leading-tight">
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}

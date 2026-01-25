// components/checkout/CheckoutForm.tsx
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createOrder } from "@/action/order/order.action";
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
} from "lucide-react";
import {
  CheckoutInput,
  DeliveryInput,
  ICartItem,
} from "@/types/checkout.interface";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Form validation schema
const formSchema = z.object({
  checkoutType: z.enum(["CART", "DIRECT"]),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  postalCode: z.string().min(4, "Please enter a valid postal code"),
  // Direct checkout fields
  variantId: z.string().optional(),
  quantity: z.number().min(1).optional(),
});

interface CheckoutFormProps {
  cartItems: ICartItem[];
  cartItemIds?: string[];
  userId?: string;
  deliveryCharge?: number;
  availableVariants?: Array<{
    id: string;
    name: string;
    price: number;
    productName: string;
    stock: number;
  }>;
  onOrderSuccess?: (order: any) => void;
}

export function CheckoutForm({
  cartItems,
  cartItemIds,
  userId,
  deliveryCharge = 0,
  availableVariants = [],
  onOrderSuccess,
}: CheckoutFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const [directQuantity, setDirectQuantity] = useState(1);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      checkoutType: cartItems.length > 0 ? "CART" : "DIRECT",
      name: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      postalCode: "",
      quantity: 1,
    },
  });

  const watchCheckoutType = form.watch("checkoutType");

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
        email: values.email,
        address: values.address,
        city: values.city,
        postalCode: values.postalCode,
        deliveryCharge,
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

      const data = await createOrder(checkoutInput);

      if (!data?.data) {
        throw new Error(data?.message || "Failed to create order");
      }

      toast("Order Created Successfully!", {
        description: `Order ID: ${data.data.id}`,
      });

      toast("Your order has been successfully placed!", {
        description: `Order #${data.data.id} - Total: $${data.data.amount.toFixed(
          2,
        )}`,
      });

      if (onOrderSuccess) {
        onOrderSuccess(data.data);
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
        className="container mx-auto px-4 py-8"
      >
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Checkout Type Selector */}
              <Card>
                <CardHeader>
                  <CardTitle>Checkout Method</CardTitle>
                  <CardDescription>
                    Choose how you want to checkout
                  </CardDescription>
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
                              <Label htmlFor="cart" className="cursor-pointer">
                                <div className="flex items-center gap-2">
                                  <ShoppingCart className="h-4 w-4" />
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
                                  <Package className="h-4 w-4" />
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

              {/* Product Selection for Direct Checkout */}
              {watchCheckoutType === "DIRECT" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Select Product</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="variant-select">Product Variant</Label>
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
                                <span className="text-muted-foreground">
                                  ${variant.price}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedVariant && (
                      <div>
                        <Label htmlFor="quantity">Quantity</Label>
                        <div className="flex items-center gap-4 mt-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              setDirectQuantity(Math.max(1, directQuantity - 1))
                            }
                            disabled={directQuantity <= 1}
                          >
                            -
                          </Button>
                          <Input
                            id="quantity"
                            type="number"
                            min="1"
                            value={directQuantity}
                            onChange={(e) =>
                              setDirectQuantity(parseInt(e.target.value) || 1)
                            }
                            className="w-20 text-center"
                          />
                          <Button
                            type="button"
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
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Cart Items Display for Cart Checkout */}
              {watchCheckoutType === "CART" && cartItems.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Cart Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {cartItems.map((item, index) => (
                        <div
                          key={item.variantId || index}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div>
                            <p className="font-semibold">
                              {item.productName || "Product"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Variant: {item.variantId}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              ${((item.price || 0) * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Qty: {item.quantity} × ${item.price?.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Delivery Information Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Information</CardTitle>
                  <CardDescription>
                    Please provide your delivery details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
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
                            <Input placeholder="+1 (555) 123-4567" {...field} />
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
                        <FormLabel>Email Address *</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="john@example.com"
                            {...field}
                          />
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
                          <Textarea
                            placeholder="123 Main St, Apt 4B"
                            className="min-h-20"
                            {...field}
                          />
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
                          <FormLabel>City *</FormLabel>
                          <FormControl>
                            <Input placeholder="New York" {...field} />
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
                          <FormLabel>Postal Code *</FormLabel>
                          <FormControl>
                            <Input placeholder="10001" {...field} />
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
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                                <span className="text-muted-foreground ml-1">
                                  ×{item.quantity}
                                </span>
                              </span>
                              <span>
                                $
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
                                <span className="text-muted-foreground ml-1">
                                  ×{directQuantity}
                                </span>
                              </span>
                              <span>${productTotal.toFixed(2)}</span>
                            </div>
                          )}
                    </div>
                  </div>

                  <Separator />

                  {/* Pricing Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${productTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Charge</span>
                      <span>${deliveryCharge.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>${grandTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      By placing this order, you agree to our terms and
                      conditions. Order confirmation will be sent to your email.
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    form="checkout-form"
                    className="w-full"
                    size="lg"
                    disabled={
                      isLoading ||
                      (watchCheckoutType === "CART" &&
                        cartItems.length === 0) ||
                      (watchCheckoutType === "DIRECT" && !selectedVariant)
                    }
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing Order...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Place Order
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>

              {/* Delivery Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    Delivery Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Charge</span>
                    <span>${deliveryCharge.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Estimated Time
                    </span>
                    <span>3-5 business days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tracking</span>
                    <span>Available after shipping</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}

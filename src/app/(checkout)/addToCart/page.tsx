// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import {
//   CreditCard,
//   Truck,
//   Gift,
//   Lock,
//   ArrowRight,
//   CheckCircle,
// } from "lucide-react";

// export default function CheckoutPage() {
//   const [step, setStep] = useState(1);
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     address: "",
//     city: "",
//     zipCode: "",
//     paymentMethod: "card",
//   });

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const subtotal = 5000;
//   const shipping = 0;
//   const tax = subtotal * 0.1;
//   const total = subtotal + shipping + tax;

//   const steps = [
//     { id: 1, title: "Shipping", icon: Truck },
//     { id: 2, title: "Payment", icon: CreditCard },
//     { id: 3, title: "Confirmation", icon: CheckCircle },
//   ];

//   return (
//     <div className="max-w-6xl mx-auto">
//       {/* Progress Steps */}
//       <div className="mb-8">
//         <div className="flex items-center justify-between mb-8">
//           {steps.map((s, idx) => {
//             const Icon = s.icon;
//             const isActive = step >= s.id;
//             const isCurrent = step === s.id;

//             return (
//               <div key={s.id} className="flex items-center flex-1">
//                 <div
//                   className={`flex items-center justify-center w-12 h-12 rounded-full transition-all ${
//                     isActive
//                       ? isCurrent
//                         ? "bg-primary text-white ring-4 ring-primary/20"
//                         : "bg-green-500 text-white"
//                       : "bg-gray-200 text-gray-600"
//                   }`}
//                 >
//                   <Icon className="w-6 h-6" />
//                 </div>
//                 <div className="ml-4">
//                   <p className="text-sm font-medium text-gray-900">{s.title}</p>
//                 </div>
//                 {idx < steps.length - 1 && (
//                   <div
//                     className={`flex-1 h-1 mx-4 rounded-full ${
//                       step > s.id ? "bg-green-500" : "bg-gray-200"
//                     }`}
//                   />
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Main Content */}
//         <div className="lg:col-span-2">
//           {/* Step 1: Shipping */}
//           {step === 1 && (
//             <Card>
//               <CardHeader>
//                 <CardTitle>Shipping Information</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <Input
//                     placeholder="First Name"
//                     name="firstName"
//                     value={formData.firstName}
//                     onChange={handleInputChange}
//                   />
//                   <Input
//                     placeholder="Last Name"
//                     name="lastName"
//                     value={formData.lastName}
//                     onChange={handleInputChange}
//                   />
//                 </div>

//                 <Input
//                   placeholder="Email Address"
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                 />

//                 <Input
//                   placeholder="Phone Number"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleInputChange}
//                 />

//                 <Input
//                   placeholder="Street Address"
//                   name="address"
//                   value={formData.address}
//                   onChange={handleInputChange}
//                 />

//                 <div className="grid grid-cols-2 gap-4">
//                   <Input
//                     placeholder="City"
//                     name="city"
//                     value={formData.city}
//                     onChange={handleInputChange}
//                   />
//                   <Input
//                     placeholder="Zip Code"
//                     name="zipCode"
//                     value={formData.zipCode}
//                     onChange={handleInputChange}
//                   />
//                 </div>

//                 <Button onClick={() => setStep(2)} className="w-full" size="lg">
//                   Continue to Payment
//                   <ArrowRight className="ml-2 w-5 h-5" />
//                 </Button>
//               </CardContent>
//             </Card>
//           )}

//           {/* Step 2: Payment */}
//           {step === 2 && (
//             <Card>
//               <CardHeader>
//                 <CardTitle>Payment Method</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="space-y-3">
//                   <label className="flex items-center p-4 border-2 border-primary rounded-lg cursor-pointer bg-primary/5">
//                     <input
//                       type="radio"
//                       name="paymentMethod"
//                       value="card"
//                       checked={formData.paymentMethod === "card"}
//                       onChange={handleInputChange}
//                       className="w-4 h-4"
//                     />
//                     <CreditCard className="w-5 h-5 ml-3 text-primary" />
//                     <span className="ml-3 font-medium">Credit/Debit Card</span>
//                   </label>

//                   <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-gray-300">
//                     <input
//                       type="radio"
//                       name="paymentMethod"
//                       value="bkash"
//                       checked={formData.paymentMethod === "bkash"}
//                       onChange={handleInputChange}
//                       className="w-4 h-4"
//                     />
//                     <span className="ml-3 font-medium">Bkash</span>
//                   </label>

//                   <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-gray-300">
//                     <input
//                       type="radio"
//                       name="paymentMethod"
//                       value="nagad"
//                       checked={formData.paymentMethod === "nagad"}
//                       onChange={handleInputChange}
//                       className="w-4 h-4"
//                     />
//                     <span className="ml-3 font-medium">Nagad</span>
//                   </label>

//                   <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-gray-300">
//                     <input
//                       type="radio"
//                       name="paymentMethod"
//                       value="cod"
//                       checked={formData.paymentMethod === "cod"}
//                       onChange={handleInputChange}
//                       className="w-4 h-4"
//                     />
//                     <Truck className="w-5 h-5 ml-3 text-gray-600" />
//                     <span className="ml-3 font-medium">Cash on Delivery</span>
//                   </label>
//                 </div>

//                 {formData.paymentMethod === "card" && (
//                   <div className="space-y-4 pt-4 border-t">
//                     <Input placeholder="Card Number" />
//                     <div className="grid grid-cols-2 gap-4">
//                       <Input placeholder="MM/YY" />
//                       <Input placeholder="CVV" />
//                     </div>
//                   </div>
//                 )}

//                 <div className="flex gap-3 pt-4">
//                   <Button
//                     variant="outline"
//                     onClick={() => setStep(1)}
//                     className="flex-1"
//                     size="lg"
//                   >
//                     Back
//                   </Button>
//                   <Button
//                     onClick={() => setStep(3)}
//                     className="flex-1"
//                     size="lg"
//                   >
//                     Place Order
//                     <ArrowRight className="ml-2 w-5 h-5" />
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           )}

//           {/* Step 3: Confirmation */}
//           {step === 3 && (
//             <Card>
//               <CardContent className="pt-12 text-center">
//                 <div className="flex justify-center mb-4">
//                   <CheckCircle className="w-16 h-16 text-green-500" />
//                 </div>
//                 <h2 className="text-3xl font-bold mb-2 text-gray-900">
//                   Order Placed Successfully!
//                 </h2>
//                 <p className="text-gray-600 mb-2">
//                   Your order #123456 has been confirmed
//                 </p>
//                 <p className="text-sm text-gray-500 mb-8">
//                   You'll receive an order confirmation email shortly
//                 </p>

//                 <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
//                   <p className="text-sm text-blue-900">
//                     <Lock className="inline w-4 h-4 mr-2" />
//                     Your payment is secure and encrypted
//                   </p>
//                 </div>

//                 <Button asChild className="w-full" size="lg">
//                   <Link href="/product">Continue Shopping</Link>
//                 </Button>
//               </CardContent>
//             </Card>
//           )}
//         </div>

//         {/* Order Summary Sidebar */}
//         <div>
//           <Card className="sticky top-24">
//             <CardHeader>
//               <CardTitle>Order Summary</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="space-y-2 pb-4 border-b">
//                 <div className="flex justify-between text-sm">
//                   <span>Subtotal</span>
//                   <span className="font-medium">৳{subtotal.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span>Tax (10%)</span>
//                   <span className="font-medium">৳{tax.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span>Shipping</span>
//                   <Badge variant="secondary" className="text-green-600">
//                     Free
//                   </Badge>
//                 </div>
//               </div>

//               <div className="flex justify-between text-lg font-bold">
//                 <span>Total</span>
//                 <span>৳{total.toFixed(2)}</span>
//               </div>

//               <div className="space-y-2 pt-4 border-t">
//                 <div className="flex items-center text-sm text-gray-600">
//                   <Gift className="w-4 h-4 mr-2" />
//                   <span>Free gift wrapping available</span>
//                 </div>
//                 <div className="flex items-center text-sm text-gray-600">
//                   <Truck className="w-4 h-4 mr-2" />
//                   <span>Delivery in 2-3 business days</span>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }

export default function AddToCartPage() {
  return <div>Page is under development</div>;
}

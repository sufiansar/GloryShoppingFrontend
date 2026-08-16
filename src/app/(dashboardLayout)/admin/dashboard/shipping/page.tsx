import { ShippingSettings } from"@/components/modules/Admin/Shipping/ShippingSettings";

export default function AdminShippingPage() {
 return (
 <div className="p-6 max-w-4xl mx-auto">
 <div className="mb-8">
 <h1 className="text-3xl font-bold">Delivery Zone Management</h1>
 <p className="text-muted-foreground mt-2">
 Configure delivery charges for different regions. Changes will be reflected instantly on the checkout page.
 </p>
 </div>

 <ShippingSettings />
 </div>
 );
}

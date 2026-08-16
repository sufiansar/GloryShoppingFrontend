"use client";

import { Button } from"@/components/ui/button";
import { useState } from"react";
import { useRouter } from"next/navigation";
import { toast } from"sonner";
import { Package, Box, Droplet, Pill, Activity, CheckCircle2, ArrowRight, ArrowLeft, Tags } from"lucide-react";

import { createProduct } from"@/action/product/product.action";
import Stepper from"./Steps/Stepper";
import BasicInfoStep from"./Steps/BasicInfoStep";
import VariantsStep from"./Steps/VariantsStep";

import IngredientsStep from"./Steps/IngredientsStep";
import ReviewStep from"./Steps/ReviewStep";
import BrandCategoryStep from"./Steps/BrandCategoryStep";
import SkinTypesStep from"./Steps/SkinTypesStep";
import SkinConcernsStep from"./Steps/SkinConcernsStep";

export default function CreateProductForm() {
 const router = useRouter();
 const [currentStep, setCurrentStep] = useState(1);
 const [isSubmitting, setIsSubmitting] = useState(false);

 // Form states
 const [formData, setFormData] = useState({
 name:"",
 slug:"",
 description:"",
 shortDesc:"",
 longDesc:"",
 faquestions:"",
 price:"",
 discount:"",
 stock:"",
 isNew: true,
 isFeatured: false,
 isTrending: true,
 isBestSeller: false,
 isStock: true,
 isActive: true,
 brandId:"",
 categoryId:"",
 thumbleImage:"",
 variants: [] as any[],
 skinTypes: [] as string[],
 skinConcerns: [] as string[],
 ingredients: [] as string[]
 });

 const steps = [
 { id: 1, title:"Basic Info", icon: Package },
 { id: 2, title:"Brand & Category", icon: Tags },
 { id: 3, title:"Variants", icon: Box },
 { id: 4, title:"Skin Types", icon: Droplet },
 { id: 5, title:"Skin Concerns", icon: Activity },
 { id: 6, title:"Ingredients", icon: Pill },
 { id: 7, title:"Review", icon: CheckCircle2 }
 ];

 const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
 const { name, value } = e.target;
 setFormData((prev) => ({ ...prev, [name]: value }));
 };

 const handleSwitchChange = (name: string, checked: boolean) => {
 setFormData((prev) => ({ ...prev, [name]: checked }));
 };

 const validateStep = () => {
 if (currentStep === 1) {
 if (!formData.name) return"Product Name is required";
 if (!formData.price) return"Price is required";
 if (!formData.stock) return"Stock is required";
 if (!formData.thumbleImage) return"Thumbnail Image is required";
 }
 if (currentStep === 2) {
 if (!formData.brandId) return"Brand is required";
 if (!formData.categoryId) return"Category is required";
 }
 return null;
 };

 const handleNext = () => {
 const error = validateStep();
 if (error) {
 toast.error(error);
 return;
 }
 if (currentStep < 7) {
 setCurrentStep(currentStep + 1);
 window.scrollTo({ top: 0, behavior:"smooth"});
 }
 };

 const handlePrev = () => {
 if (currentStep > 1) {
 setCurrentStep(currentStep - 1);
 window.scrollTo({ top: 0, behavior:"smooth"});
 }
 };

 const handleSubmit = async () => {
 try {
 setIsSubmitting(true);

 const payload = {
 name: formData.name,
 slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
 description: formData.description,
 shortDesc: formData.shortDesc,
 longDesc: formData.longDesc,
 faquestions: formData.faquestions,
 price: parseFloat(formData.price ||"0"),
 discount: parseFloat(formData.discount ||"0"),
 stock: parseInt(formData.stock ||"0", 10),
 isNew: formData.isNew,
 isFeatured: formData.isFeatured,
 isTrending: formData.isTrending,
 isBestSeller: formData.isBestSeller,
 isStock: formData.isStock,
 isActive: formData.isActive,
 brandId: formData.brandId,
 categoryId: formData.categoryId,
 thumbleImage: formData.thumbleImage,
 variants: formData.variants.map((v) => ({
 ...v,
 price: parseFloat(v.price),
 stock: parseInt(v.stock, 10),
 lowStockThreshold: parseInt(v.lowStockThreshold ||"5", 10)
 })),
 skinTypes: formData.skinTypes,
 skinConcerns: formData.skinConcerns,
 ingredients: formData.ingredients
 };

 const res = await createProduct(payload);

 if (res?.success === false) {
 throw new Error(res.message ||"Failed to create product");
 }

 toast.success("Product created successfully!");
 router.push("/admin/dashboard/products");
 router.refresh();
 } catch (error) {
 console.error("Create error:", error);
 toast.error(error instanceof Error ? error.message :"Failed to create product");
 } finally {
 setIsSubmitting(false);
 }
 };

 return (
 <div className="w-full max-w-5xl mx-auto pb-32">
 <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-6 md:p-10 lg:p-14 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-800">
 <Stepper currentStep={currentStep} steps={steps} />

 <div className="mt-12">
 {currentStep === 1 && (
 <BasicInfoStep
 formData={formData}
 setFormData={setFormData}
 handleChange={handleChange}
 handleSwitchChange={handleSwitchChange}
 />
 )}
 {currentStep === 2 && <BrandCategoryStep formData={formData} handleChange={handleChange} setFormData={setFormData} />}
 {currentStep === 3 && <VariantsStep formData={formData} setFormData={setFormData} />}
 {currentStep === 4 && <SkinTypesStep formData={formData} setFormData={setFormData} />}
 {currentStep === 5 && <SkinConcernsStep formData={formData} setFormData={setFormData} />}
 {currentStep === 6 && <IngredientsStep formData={formData} setFormData={setFormData} />}
 {currentStep === 7 && <ReviewStep formData={formData} />}
 </div>

 {/* Global Action Bar */}
 <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-6">
 {currentStep > 1 ? (
 <Button
 type="button"
 variant="outline"
 onClick={handlePrev}
 disabled={isSubmitting}
 className="rounded-2xl h-14 px-8 border-slate-200 dark:border-slate-700 font-medium text-sm"
 >
 <ArrowLeft className="h-4 w-4 mr-2"/>
 Back
 </Button>
 ) : (
 <Button
 type="button"
 variant="ghost"
 onClick={() => router.back()}
 disabled={isSubmitting}
 className="rounded-2xl h-14 px-8 text-sm font-medium text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700"
 >
 Cancel
 </Button>
 )}

 {currentStep < 7 ? (
 <Button
 type="button"
 onClick={handleNext}
 className="rounded-2xl h-14 px-10 bg-primary-custom text-white font-medium text-sm shadow-xl shadow-primary-custom/20 hover:shadow-primary-custom/40 transition-all hover:scale-[1.02] active:scale-[0.98] border-none"
 >
 Continue
 <ArrowRight className="h-4 w-4 ml-2"/>
 </Button>
 ) : (
 <Button
 type="button"
 onClick={handleSubmit}
 disabled={isSubmitting}
 className="rounded-2xl h-14 px-10 bg-primary-custom text-white font-medium text-sm shadow-xl shadow-primary-custom/20 hover:shadow-primary-custom/40 transition-all active:scale-[0.98] disabled:opacity-50 border-none"
 >
 {isSubmitting ?"Creating...":"Confirm & Create"}
 </Button>
 )}
 </div>
 </div>
 </div>
 );
}

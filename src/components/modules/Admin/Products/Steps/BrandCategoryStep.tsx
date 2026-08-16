import { Label } from"@/components/ui/label";
import { Building2, Folder, Tags, Check, ChevronsUpDown, PlusCircle } from"lucide-react";
import { useEffect, useState, useRef } from"react";
import { getAllBrand, createBrand } from"@/action/brand/brand.action";
import { fetchAllCategories, createCategoriesAction } from"@/action/categories/categories.action";
import { Popover, PopoverContent, PopoverTrigger } from"@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from"@/components/ui/command";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from"@/components/ui/dialog";
import { Button } from"@/components/ui/button";
import { Input } from"@/components/ui/input";
import { Textarea } from"@/components/ui/textarea";
import { toast } from"sonner";
import { cn } from"@/lib/utils";

interface BrandCategoryStepProps {
 formData: any;
 handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
 setFormData?: (data: any) => void;
}

export default function BrandCategoryStep({ formData, handleChange, setFormData }: BrandCategoryStepProps) {
 const [brands, setBrands] = useState<any[]>([]);
 const [categories, setCategories] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);

 // Popover states
 const [openBrand, setOpenBrand] = useState(false);
 const [openCategory, setOpenCategory] = useState(false);

 // Dialog states
 const [showBrandForm, setShowBrandForm] = useState(false);
 const [showCategoryForm, setShowCategoryForm] = useState(false);
 const [isCreatingBrand, setIsCreatingBrand] = useState(false);
 const [isCreatingCategory, setIsCreatingCategory] = useState(false);

 // New Brand State
 const [newBrandName, setNewBrandName] = useState("");
 const [newBrandCountry, setNewBrandCountry] = useState("");
 const brandLogoRef = useRef<HTMLInputElement>(null);

 // New Category State
 const [newCategoryName, setNewCategoryName] = useState("");
 const [newCategoryDesc, setNewCategoryDesc] = useState("");
 const categoryImageRef = useRef<HTMLInputElement>(null);

 useEffect(() => {
 const fetchData = async () => {
 setLoading(true);
 try {
 const [brandsRes, categoriesRes] = await Promise.all([
 getAllBrand("limit=100"),
 fetchAllCategories("limit=100")
 ]);
 
 if (brandsRes?.data) setBrands(brandsRes.data);
 if (categoriesRes?.data) setCategories(categoriesRes.data);
 } catch (error) {
 console.error("Failed to fetch brands or categories", error);
 } finally {
 setLoading(false);
 }
 };
 fetchData();
 }, []);

 const handleCreateBrand = async () => {
 if (!newBrandName.trim()) {
 toast.error("Brand name is required");
 return;
 }
 try {
 setIsCreatingBrand(true);
 const payload = new FormData();
 payload.append("data", JSON.stringify({ name: newBrandName.trim(), country: newBrandCountry.trim() }));
 
 if (brandLogoRef.current?.files?.[0]) {
 payload.append("logo", brandLogoRef.current.files[0]);
 }

 const res = await createBrand(payload);
 if (res?.data?.id || res?.success) {
 const newItem = res.data || res;
 toast.success("Brand created successfully!");
 setBrands((prev) => [newItem, ...prev]);
 setFormData?.({ ...formData, brandId: newItem.id });
 setShowBrandForm(false);
 setNewBrandName("");
 setNewBrandCountry("");
 } else {
 toast.error("Failed to create brand");
 }
 } catch (error) {
 console.error(error);
 toast.error("Failed to create brand");
 } finally {
 setIsCreatingBrand(false);
 }
 };

 const handleCreateCategory = async () => {
 if (!newCategoryName.trim()) {
 toast.error("Category name is required");
 return;
 }
 try {
 setIsCreatingCategory(true);
 const payload = new FormData();
 payload.append("name", newCategoryName.trim());
 payload.append("description", newCategoryDesc.trim());
 
 if (categoryImageRef.current?.files?.[0]) {
 payload.append("images", categoryImageRef.current.files[0]);
 }

 const res = await createCategoriesAction(payload);
 if (res?.data?.id || res?.success) {
 const newItem = res.data || res;
 toast.success("Category created successfully!");
 setCategories((prev) => [newItem, ...prev]);
 setFormData?.({ ...formData, categoryId: newItem.id });
 setShowCategoryForm(false);
 setNewCategoryName("");
 setNewCategoryDesc("");
 } else {
 toast.error("Failed to create category");
 }
 } catch (error) {
 console.error(error);
 toast.error("Failed to create category");
 } finally {
 setIsCreatingCategory(false);
 }
 };

 return (
 <div className="space-y-8 animate-in fade-in duration-500">
 <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/40 dark:border-slate-800/50 shadow-sm space-y-6">
 <div className="flex items-center gap-3 mb-6">
 <div className="h-10 w-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center border border-indigo-500/20">
 <Tags className="h-5 w-5 text-indigo-500"/>
 </div>
 <div>
 <h2 className="text-xl font-medium text-slate-900 dark:text-white">Brand & Category</h2>
 <p className="text-sm font-medium text-slate-400 -mt-1">Select organization details</p>
 </div>
 </div>

 {loading ? (
 <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-custom"/></div>
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 
 {/* BRAND SELECTION */}
 <div className="space-y-2 flex flex-col">
 <Label className="text-sm font-medium text-slate-400 flex items-center gap-2 ml-1">
 <Building2 className="h-4 w-4 text-primary-custom"/>
 Brand *
 </Label>
 <Popover open={openBrand} onOpenChange={setOpenBrand}>
 <PopoverTrigger asChild>
 <Button
 variant="outline"
 role="combobox"
 aria-expanded={openBrand}
 className="w-full h-14 px-4 bg-white/60 dark:bg-slate-800/40 backdrop-blur-md rounded-2xl shadow-inner font-bold border border-slate-200 dark:border-slate-700 justify-between"
 >
 {formData.brandId
 ? brands.find((b) => b.id === formData.brandId)?.name ||"Selected Brand"
 :"Search brand..."}
 <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
 </Button>
 </PopoverTrigger>
 <PopoverContent className="w-[300px] p-0"align="start">
 <Command>
 <CommandInput placeholder="Search brand..."/>
 <CommandList>
 <CommandEmpty>
 <div className="flex flex-col items-center justify-center p-4">
 <p className="mb-4 text-sm text-muted-foreground">No brand found.</p>
 <Button size="sm"onClick={() => { setOpenBrand(false); setShowBrandForm(true); }}>
 <PlusCircle className="mr-2 h-4 w-4"/> Create Brand
 </Button>
 </div>
 </CommandEmpty>
 <CommandGroup>
 {brands.map((b) => (
 <CommandItem
 key={b.id}
 value={b.name}
 onSelect={(currentValue) => {
 setFormData?.({ ...formData, brandId: b.id });
 setOpenBrand(false);
 }}
 >
 <Check
 className={cn(
"mr-2 h-4 w-4",
 formData.brandId === b.id ?"opacity-100":"opacity-0"
 )}
 />
 {b.name}
 </CommandItem>
 ))}
 </CommandGroup>
 </CommandList>
 </Command>
 </PopoverContent>
 </Popover>

 <Dialog open={showBrandForm} onOpenChange={setShowBrandForm}>
 <DialogContent>
 <DialogHeader>
 <DialogTitle>Create New Brand</DialogTitle>
 </DialogHeader>
 <div className="space-y-4 py-4">
 <div className="space-y-2">
 <Label>Brand Name *</Label>
 <Input value={newBrandName} onChange={(e) => setNewBrandName(e.target.value)} placeholder="Enter brand name"/>
 </div>
 <div className="space-y-2">
 <Label>Country</Label>
 <Input value={newBrandCountry} onChange={(e) => setNewBrandCountry(e.target.value)} placeholder="e.g. America"/>
 </div>
 <div className="space-y-2">
 <Label>Brand Logo</Label>
 <Input type="file"ref={brandLogoRef} accept="image/*"/>
 </div>
 <div className="flex justify-end pt-4">
 <Button onClick={handleCreateBrand} disabled={isCreatingBrand || !newBrandName.trim()}>
 {isCreatingBrand ?"Creating...":"Save Brand"}
 </Button>
 </div>
 </div>
 </DialogContent>
 </Dialog>
 </div>

 {/* CATEGORY SELECTION */}
 <div className="space-y-2 flex flex-col">
 <Label className="text-sm font-medium text-slate-400 flex items-center gap-2 ml-1">
 <Folder className="h-4 w-4 text-primary-custom"/>
 Category *
 </Label>
 <Popover open={openCategory} onOpenChange={setOpenCategory}>
 <PopoverTrigger asChild>
 <Button
 variant="outline"
 role="combobox"
 aria-expanded={openCategory}
 className="w-full h-14 px-4 bg-white/60 dark:bg-slate-800/40 backdrop-blur-md rounded-2xl shadow-inner font-bold border border-slate-200 dark:border-slate-700 justify-between"
 >
 {formData.categoryId
 ? categories.find((c) => c.id === formData.categoryId)?.name ||"Selected Category"
 :"Search category..."}
 <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
 </Button>
 </PopoverTrigger>
 <PopoverContent className="w-[300px] p-0"align="start">
 <Command>
 <CommandInput placeholder="Search category..."/>
 <CommandList>
 <CommandEmpty>
 <div className="flex flex-col items-center justify-center p-4">
 <p className="mb-4 text-sm text-muted-foreground">No category found.</p>
 <Button size="sm"onClick={() => { setOpenCategory(false); setShowCategoryForm(true); }}>
 <PlusCircle className="mr-2 h-4 w-4"/> Create Category
 </Button>
 </div>
 </CommandEmpty>
 <CommandGroup>
 {categories.map((c) => (
 <CommandItem
 key={c.id}
 value={c.name}
 onSelect={(currentValue) => {
 setFormData?.({ ...formData, categoryId: c.id });
 setOpenCategory(false);
 }}
 >
 <Check
 className={cn(
"mr-2 h-4 w-4",
 formData.categoryId === c.id ?"opacity-100":"opacity-0"
 )}
 />
 {c.name}
 </CommandItem>
 ))}
 </CommandGroup>
 </CommandList>
 </Command>
 </PopoverContent>
 </Popover>

 <Dialog open={showCategoryForm} onOpenChange={setShowCategoryForm}>
 <DialogContent>
 <DialogHeader>
 <DialogTitle>Create New Category</DialogTitle>
 </DialogHeader>
 <div className="space-y-4 py-4">
 <div className="space-y-2">
 <Label>Category Name *</Label>
 <Input value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="Enter category name"/>
 </div>
 <div className="space-y-2">
 <Label>Description</Label>
 <Textarea value={newCategoryDesc} onChange={(e) => setNewCategoryDesc(e.target.value)} placeholder="Category description"/>
 </div>
 <div className="space-y-2">
 <Label>Category Image</Label>
 <Input type="file"ref={categoryImageRef} accept="image/*"/>
 </div>
 <div className="flex justify-end pt-4">
 <Button onClick={handleCreateCategory} disabled={isCreatingCategory || !newCategoryName.trim()}>
 {isCreatingCategory ?"Creating...":"Save Category"}
 </Button>
 </div>
 </div>
 </DialogContent>
 </Dialog>
 </div>
 
 </div>
 )}
 </div>
 </div>
 );
}

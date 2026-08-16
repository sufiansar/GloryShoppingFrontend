import { Label } from"@/components/ui/label";
import { Checkbox } from"@/components/ui/checkbox";
import { Pill } from"lucide-react";
import { useEffect, useState } from"react";
import { getAllIngredients, createIngreadtAction } from"@/action/ingredian/ingrediant.action";
import { Input } from"@/components/ui/input";
import { Button } from"@/components/ui/button";
import { Textarea } from"@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from"@/components/ui/dialog";
import { toast } from"sonner";

interface IngredientsStepProps {
 formData: any;
 setFormData: (data: any) => void;
}

export default function IngredientsStep({ formData, setFormData }: IngredientsStepProps) {
 const [ingredients, setIngredients] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);
 const [showForm, setShowForm] = useState(false);
 const [isCreating, setIsCreating] = useState(false);
 const [newIngredient, setNewIngredient] = useState({
 name:"",
 description:"",
 benefits:"",
 sideEffects:"",
 usage:"",
 precautions:"",
 safetyLevel:"SAFE",
 });

 useEffect(() => {
 const fetchIngredients = async () => {
 setLoading(true);
 try {
 const res = await getAllIngredients("limit=100");
 if (res?.data) {
 setIngredients(res.data);
 }
 } catch (error) {
 console.error("Failed to fetch ingredients", error);
 } finally {
 setLoading(false);
 }
 };

 fetchIngredients();
 }, []);

 const handleCheckboxChange = (id: string) => {
 const currentList = formData.ingredients || [];
 const index = currentList.indexOf(id);
 
 let newList = [...currentList];
 if (index === -1) {
 newList.push(id);
 } else {
 newList.splice(index, 1);
 }

 setFormData({ ...formData, ingredients: newList });
 };

 const handleCreate = async () => {
 if (!newIngredient.name.trim()) {
 toast.error("Name is required");
 return;
 }
 try {
 setIsCreating(true);
 const payload = {
 ...newIngredient,
 name: newIngredient.name.trim(),
 isActive: true,
 };
 const res = await createIngreadtAction(payload);
 if (res?.data?.id || res?.success) {
 const newItem = res.data || res;
 toast.success("Ingredient created successfully!");
 setIngredients((prev) => [newItem, ...prev]);
 setNewIngredient({
 name:"",
 description:"",
 benefits:"",
 sideEffects:"",
 usage:"",
 precautions:"",
 safetyLevel:"SAFE",
 });
 setShowForm(false);
 // Automatically select the new ingredient
 handleCheckboxChange(newItem.id);
 } else {
 toast.error("Failed to create ingredient");
 }
 } catch (error) {
 console.error(error);
 toast.error("Failed to create ingredient");
 } finally {
 setIsCreating(false);
 }
 };

 return (
 <div className="space-y-8 animate-in fade-in duration-500">
 <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/40 dark:border-slate-800/50 shadow-sm space-y-6">
 <div className="flex items-center gap-3 mb-6">
 <div className="h-10 w-10 rounded-xl bg-teal-500/10 dark:bg-teal-500/20 flex items-center justify-center border border-teal-500/20">
 <Pill className="h-5 w-5 text-teal-500"/>
 </div>
 <div>
 <h2 className="text-xl font-medium text-slate-900 dark:text-white">Active Ingredients</h2>
 <p className="text-sm font-medium text-slate-400 -mt-1">Select components</p>
 </div>
 </div>

 <div className="mb-6">
 <Dialog open={showForm} onOpenChange={setShowForm}>
 <DialogTrigger asChild>
 <Button variant="outline"className="w-full sm:w-auto">
 + Add New Ingredient
 </Button>
 </DialogTrigger>
 <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
 <DialogHeader>
 <DialogTitle>Add New Ingredient</DialogTitle>
 </DialogHeader>
 
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
 <div className="space-y-2">
 <Label>Name *</Label>
 <Input 
 placeholder="e.g. Aloe Vera"
 value={newIngredient.name} 
 onChange={(e) => setNewIngredient({...newIngredient, name: e.target.value})} 
 />
 </div>
 <div className="space-y-2">
 <Label>Safety Level</Label>
 <select 
 className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
 value={newIngredient.safetyLevel}
 onChange={(e) => setNewIngredient({...newIngredient, safetyLevel: e.target.value})}
 >
 <option value="SAFE">SAFE</option>
 <option value="MODERATE">MODERATE</option>
 <option value="RISKY">RISKY</option>
 </select>
 </div>
 <div className="space-y-2 md:col-span-2">
 <Label>Description</Label>
 <Textarea 
 placeholder="A soothing plant extract..."
 value={newIngredient.description} 
 onChange={(e) => setNewIngredient({...newIngredient, description: e.target.value})} 
 />
 </div>
 <div className="space-y-2">
 <Label>Benefits</Label>
 <Textarea 
 placeholder="Moisturizes skin..."
 value={newIngredient.benefits} 
 onChange={(e) => setNewIngredient({...newIngredient, benefits: e.target.value})} 
 />
 </div>
 <div className="space-y-2">
 <Label>Side Effects</Label>
 <Textarea 
 placeholder="Rarely may cause..."
 value={newIngredient.sideEffects} 
 onChange={(e) => setNewIngredient({...newIngredient, sideEffects: e.target.value})} 
 />
 </div>
 <div className="space-y-2">
 <Label>Usage</Label>
 <Textarea 
 placeholder="Apply a thin layer..."
 value={newIngredient.usage} 
 onChange={(e) => setNewIngredient({...newIngredient, usage: e.target.value})} 
 />
 </div>
 <div className="space-y-2">
 <Label>Precautions</Label>
 <Textarea 
 placeholder="Do not use on open wounds..."
 value={newIngredient.precautions} 
 onChange={(e) => setNewIngredient({...newIngredient, precautions: e.target.value})} 
 />
 </div>
 </div>
 <div className="flex justify-end pt-4">
 <Button onClick={handleCreate} disabled={isCreating || !newIngredient.name.trim()}>
 {isCreating ?"Creating...":"Save Ingredient"}
 </Button>
 </div>
 </DialogContent>
 </Dialog>
 </div>

 {loading ? (
 <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-custom"/></div>
 ) : ingredients.length === 0 ? (
 <p className="text-sm text-slate-500 text-center py-12">No ingredients found.</p>
 ) : (
 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
 {ingredients.map((ingredient) => (
 <div key={ingredient.id} className="flex items-start space-x-3 p-4 rounded-2xl hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700 bg-white/20 dark:bg-slate-900/20">
 <Checkbox 
 id={`ing-${ingredient.id}`} 
 checked={formData.ingredients?.includes(ingredient.id)}
 onCheckedChange={() => handleCheckboxChange(ingredient.id)}
 className="mt-1 data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500"
 />
 <div className="grid gap-1.5 leading-none cursor-pointer flex-1"onClick={() => handleCheckboxChange(ingredient.id)}>
 <Label htmlFor={`ing-${ingredient.id}`} className="text-sm font-bold cursor-pointer">{ingredient.name}</Label>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 </div>
 );
}

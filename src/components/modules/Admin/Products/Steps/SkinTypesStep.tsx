import { Label } from"@/components/ui/label";
import { Checkbox } from"@/components/ui/checkbox";
import { Droplet } from"lucide-react";
import { useEffect, useState } from"react";
import { getAllSkinType, createSkinType } from"@/action/skinType/skin.action";
import { Input } from"@/components/ui/input";
import { Button } from"@/components/ui/button";
import { toast } from"sonner";

interface SkinTypesStepProps {
 formData: any;
 setFormData: (data: any) => void;
}

export default function SkinTypesStep({ formData, setFormData }: SkinTypesStepProps) {
 const [skinTypes, setSkinTypes] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);
 const [newName, setNewName] = useState("");
 const [isCreating, setIsCreating] = useState(false);

 useEffect(() => {
 const fetchSymptoms = async () => {
 setLoading(true);
 try {
 const typesRes = (await getAllSkinType("limit=100")) as any;
 if (typesRes?.data) setSkinTypes(typesRes.data);
 } catch (error) {
 console.error("Failed to fetch skin types", error);
 } finally {
 setLoading(false);
 }
 };
 fetchSymptoms();
 }, []);

 const handleCheckboxChange = (id: string) => {
 const currentList = formData.skinTypes || [];
 const index = currentList.indexOf(id);
 let newList = [...currentList];
 if (index === -1) {
 newList.push(id);
 } else {
 newList.splice(index, 1);
 }
 setFormData({ ...formData, skinTypes: newList });
 };

 const handleCreate = async () => {
 if (!newName.trim()) return;
 try {
 setIsCreating(true);
 const res = await createSkinType(JSON.stringify({ name: newName.trim() }));
 if (res?.data?.id || res?.success) {
 const newItem = res.data || res;
 toast.success("Skin Type created successfully!");
 setSkinTypes((prev) => [newItem, ...prev]);
 setNewName("");
 // Automatically select the new type
 handleCheckboxChange(newItem.id);
 } else {
 toast.error("Failed to create skin type");
 }
 } catch (error) {
 console.error(error);
 toast.error("Failed to create skin type");
 } finally {
 setIsCreating(false);
 }
 };

 return (
 <div className="space-y-8 animate-in fade-in duration-500">
 <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/40 dark:border-slate-800/50 shadow-sm space-y-6">
 <div className="flex items-center gap-3 mb-6">
 <div className="h-10 w-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center border border-blue-500/20">
 <Droplet className="h-5 w-5 text-blue-500"/>
 </div>
 <div>
 <h2 className="text-xl font-medium text-slate-900 dark:text-white">Skin Types</h2>
 <p className="text-sm font-medium text-slate-400 -mt-1">Select suitable skin types</p>
 </div>
 </div>

 <div className="flex items-center gap-2 mb-4">
 <Input 
 placeholder="Type new skin type name..."
 value={newName} 
 onChange={(e) => setNewName(e.target.value)} 
 className="flex-1"
 />
 <Button onClick={handleCreate} disabled={isCreating || !newName.trim()}>
 {isCreating ?"Creating...":"Create New"}
 </Button>
 </div>

 {loading ? (
 <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-custom"/></div>
 ) : skinTypes.length === 0 ? (
 <p className="text-sm text-slate-500 text-center py-4">No skin types found.</p>
 ) : (
 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
 {skinTypes.map((type) => (
 <div key={type.id} className="flex items-start space-x-3 p-4 rounded-xl hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700 bg-white/20 dark:bg-slate-900/20">
 <Checkbox 
 id={`type-${type.id}`} 
 checked={formData.skinTypes?.includes(type.id)}
 onCheckedChange={() => handleCheckboxChange(type.id)}
 className="mt-1 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
 />
 <div className="grid gap-1.5 leading-none cursor-pointer flex-1"onClick={() => handleCheckboxChange(type.id)}>
 <Label htmlFor={`type-${type.id}`} className="text-sm font-bold cursor-pointer">{type.name}</Label>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 </div>
 );
}

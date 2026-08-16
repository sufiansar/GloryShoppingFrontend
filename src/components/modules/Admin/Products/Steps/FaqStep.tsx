import { Input } from"@/components/ui/input";
import { Label } from"@/components/ui/label";
import { Button } from"@/components/ui/button";
import { Textarea } from"@/components/ui/textarea";
import { HelpCircle, Plus, Trash2 } from"lucide-react";
import { useState, useEffect } from"react";

interface FaqStepProps {
 formData: any;
 setFormData: (data: any) => void;
}

export default function FaqStep({ formData, setFormData }: FaqStepProps) {
 const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>([]);

 // Parse existing JSON string on mount if any
 useEffect(() => {
 if (formData.faquestions) {
 try {
 const parsed = JSON.parse(formData.faquestions);
 if (Array.isArray(parsed)) {
 setFaqs(parsed);
 } else {
 // It might be just a string
 setFaqs([{ question:"FAQ", answer: formData.faquestions }]);
 }
 } catch (e) {
 // Not JSON, just text
 setFaqs([{ question:"General Question", answer: formData.faquestions }]);
 }
 }
 }, []);

 // Sync to formData as JSON string
 const syncToFormData = (newFaqs: any[]) => {
 setFaqs(newFaqs);
 setFormData({ ...formData, faquestions: JSON.stringify(newFaqs) });
 };

 const addFaq = () => {
 syncToFormData([...faqs, { question:"", answer:""}]);
 };

 const removeFaq = (index: number) => {
 const newFaqs = [...faqs];
 newFaqs.splice(index, 1);
 syncToFormData(newFaqs);
 };

 const handleFaqChange = (index: number, field:"question"|"answer", value: string) => {
 const newFaqs = [...faqs];
 newFaqs[index][field] = value;
 syncToFormData(newFaqs);
 };

 return (
 <div className="space-y-8 animate-in fade-in duration-500">
 <div className="flex items-center justify-between bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/40 dark:border-slate-800/50 shadow-sm">
 <div className="flex items-center gap-3">
 <div className="h-10 w-10 rounded-xl bg-pink-500/10 dark:bg-pink-500/20 flex items-center justify-center border border-pink-500/20">
 <HelpCircle className="h-5 w-5 text-pink-500"/>
 </div>
 <div>
 <h2 className="text-xl font-medium text-slate-900 dark:text-white">FAQ Questions</h2>
 <p className="text-sm font-medium text-slate-400 -mt-1">Common customer queries</p>
 </div>
 </div>
 <Button type="button"onClick={addFaq} className="rounded-xl h-10 px-6 bg-pink-500 hover:bg-pink-600 text-white font-medium text-sm shadow-lg shadow-pink-500/20 transition-all active:scale-95 border-none">
 <Plus className="h-4 w-4 mr-2"/>
 Add Q&A
 </Button>
 </div>

 {faqs.length === 0 ? (
 <div className="text-center py-12 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-dashed border-slate-300 dark:border-slate-700">
 <HelpCircle className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-600 mb-4"/>
 <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-1">No FAQs</h3>
 <p className="text-sm font-bold text-slate-400">Click 'Add Q&A' to help your customers.</p>
 </div>
 ) : (
 <div className="space-y-4">
 {faqs.map((faq, index) => (
 <div key={index} className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-6 rounded-[2rem] border border-white/40 dark:border-slate-800/50 shadow-sm relative group">
 <div className="absolute top-0 right-0 p-4">
 <Button type="button"variant="destructive"size="icon"onClick={() => removeFaq(index)} className="h-8 w-8 rounded-full opacity-50 group-hover:opacity-100 transition-opacity">
 <Trash2 className="h-4 w-4"/>
 </Button>
 </div>
 
 <div className="space-y-4 pr-10">
 <div className="space-y-2">
 <Label className="text-sm font-medium text-slate-400 ml-1">Question</Label>
 <Input value={faq.question} onChange={(e) => handleFaqChange(index,"question", e.target.value)} placeholder="e.g. Can I use it daily?"className="h-12 bg-white/60 dark:bg-slate-800/40 rounded-xl font-bold text-sm"/>
 </div>
 <div className="space-y-2">
 <Label className="text-sm font-medium text-slate-400 ml-1">Answer</Label>
 <Textarea value={faq.answer} onChange={(e) => handleFaqChange(index,"answer", e.target.value)} placeholder="e.g. Yes, twice a day."rows={2} className="bg-white/60 dark:bg-slate-800/40 rounded-xl font-bold text-sm"/>
 </div>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 );
}

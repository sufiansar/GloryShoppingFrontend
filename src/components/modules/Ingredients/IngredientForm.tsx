"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Loader2, Save, FlaskConical, ShieldAlert, Activity, HeartPulse, Info, CheckCircle2, X } from "lucide-react";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { IIngredient } from "@/types/ingrediant.interface";
import {
  createIngreadtAction,
  updateIngredient,
} from "@/action/ingredian/ingrediant.action";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  benefits: z.string().optional(),
  sideEffects: z.string().optional(),
  usage: z.string().optional(),
  precautions: z.string().optional(),
  isActive: z.boolean(),
  safetyLevel: z.enum(["SAFE", "MODERATE", "RESTRICTED", "CAUTION", "UNSAFE"]),
});

type FormValues = z.infer<typeof formSchema>;

interface IngredientFormProps {
  initialData?: IIngredient;
  isEdit?: boolean;
}

export default function IngredientForm({
  initialData,
  isEdit = false,
}: IngredientFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      benefits: "",
      sideEffects: "",
      usage: "",
      precautions: "",
      isActive: true,
      safetyLevel: "SAFE",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      if (isEdit && initialData?.id) {
        await updateIngredient(initialData.id, data);
        toast.success("Ingredient updated successfully");
        router.push("/admin/dashboard/ingredients");
      } else {
        const result = await createIngreadtAction(data);
        toast.success("Ingredient created successfully");
        form.reset();
        router.push(`/admin/dashboard/ingredients/join`);
      }
    } catch (error) {
      toast.error("Failed to save ingredient");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] border border-white/40 dark:border-slate-800/50 shadow-sm relative overflow-hidden">
        {/* Decorative Element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-custom/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-10">
            <div className="h-14 w-14 rounded-2xl bg-primary-custom/10 dark:bg-primary-custom/20 flex items-center justify-center border border-primary-custom/20 shadow-inner">
              <FlaskConical className="h-7 w-7 text-primary-custom" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                {isEdit ? "Update Ingredient" : "Create Ingredient"}
              </h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] -mt-1">Chemical Composition & Safety Data</p>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
              <div className="grid gap-8 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <div className="flex items-center gap-2 ml-1">
                        <Info className="h-3.5 w-3.5 text-primary-custom" />
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Name *</FormLabel>
                      </div>
                      <FormControl>
                        <Input 
                          placeholder="Enter ingredient name" 
                          {...field} 
                          className="h-14 bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border-white/20 dark:border-slate-800/50 rounded-2xl shadow-inner focus-visible:ring-primary-custom/30 font-bold transition-all duration-300"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] uppercase font-black tracking-widest text-rose-500 ml-1" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="safetyLevel"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <div className="flex items-center gap-2 ml-1">
                        <ShieldAlert className="h-3.5 w-3.5 text-primary-custom" />
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Safety Level *</FormLabel>
                      </div>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-14 bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border-white/20 dark:border-slate-800/50 rounded-2xl shadow-inner focus:ring-primary-custom/30 font-bold transition-all duration-300">
                            <SelectValue placeholder="Select safety level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-2xl border-white/20 dark:border-slate-800/50 backdrop-blur-2xl">
                          <SelectItem value="SAFE" className="rounded-xl font-bold uppercase text-[10px] tracking-widest">Safe</SelectItem>
                          <SelectItem value="MODERATE" className="rounded-xl font-bold uppercase text-[10px] tracking-widest">Moderate</SelectItem>
                          <SelectItem value="CAUTION" className="rounded-xl font-bold uppercase text-[10px] tracking-widest">Caution</SelectItem>
                          <SelectItem value="RESTRICTED" className="rounded-xl font-bold uppercase text-[10px] tracking-widest">Restricted</SelectItem>
                          <SelectItem value="UNSAFE" className="rounded-xl font-bold uppercase text-[10px] tracking-widest">Unsafe</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-[10px] uppercase font-black tracking-widest text-rose-500 ml-1" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-3xl bg-white/40 dark:bg-slate-800/20 p-6 border border-white/40 dark:border-slate-800/50 transition-all duration-300 hover:bg-white/60">
                    <div className="space-y-1">
                      <FormLabel className="text-[11px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-200">Active Status</FormLabel>
                      <FormDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                        Deactivated ingredients won't appear in product selections
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-primary-custom"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="bg-white/40 dark:bg-slate-800/20 p-8 rounded-[2rem] border border-white/20 dark:border-slate-800/50 space-y-8">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <div className="flex items-center gap-2 ml-1">
                        <Activity className="h-3.5 w-3.5 text-primary-custom" />
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description</FormLabel>
                      </div>
                      <FormControl>
                        <Textarea
                          placeholder="Enter ingredient description"
                          className="min-h-[120px] bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border-white/20 dark:border-slate-800/50 rounded-2xl shadow-inner focus-visible:ring-primary-custom/30 font-bold transition-all duration-300 resize-none px-5 py-4"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] uppercase font-black tracking-widest text-rose-500 ml-1" />
                    </FormItem>
                  )}
                />

                <div className="grid gap-8 md:grid-cols-2 pt-4">
                  <FormField
                    control={form.control}
                    name="benefits"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <div className="flex items-center gap-2 ml-1">
                          <HeartPulse className="h-3.5 w-3.5 text-emerald-500" />
                          <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Benefits</FormLabel>
                        </div>
                        <FormControl>
                          <Textarea
                            placeholder="Enter benefits"
                            className="min-h-[100px] bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border-white/20 dark:border-slate-800/50 rounded-2xl shadow-inner focus-visible:ring-emerald-500/30 font-bold transition-all duration-300 resize-none px-5 py-4"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-[10px] uppercase font-black tracking-widest text-rose-500 ml-1" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sideEffects"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <div className="flex items-center gap-2 ml-1">
                          <ShieldAlert className="h-3.5 w-3.5 text-rose-500" />
                          <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Side Effects</FormLabel>
                        </div>
                        <FormControl>
                          <Textarea
                            placeholder="Enter side effects"
                            className="min-h-[100px] bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border-white/20 dark:border-slate-800/50 rounded-2xl shadow-inner focus-visible:ring-rose-500/30 font-bold transition-all duration-300 resize-none px-5 py-4"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-[10px] uppercase font-black tracking-widest text-rose-500 ml-1" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="usage"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <div className="flex items-center gap-2 ml-1">
                          <CheckCircle2 className="h-3.5 w-3.5 text-primary-custom" />
                          <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Usage Instructions</FormLabel>
                        </div>
                        <FormControl>
                          <Textarea
                            placeholder="Enter usage instructions"
                            className="min-h-[100px] bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border-white/20 dark:border-slate-800/50 rounded-2xl shadow-inner focus-visible:ring-primary-custom/30 font-bold transition-all duration-300 resize-none px-5 py-4"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-[10px] uppercase font-black tracking-widest text-rose-500 ml-1" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="precautions"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <div className="flex items-center gap-2 ml-1">
                          <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
                          <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Precautions</FormLabel>
                        </div>
                        <FormControl>
                          <Textarea
                            placeholder="Enter precautions"
                            className="min-h-[100px] bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border-white/20 dark:border-slate-800/50 rounded-2xl shadow-inner focus-visible:ring-amber-500/30 font-bold transition-all duration-300 resize-none px-5 py-4"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-[10px] uppercase font-black tracking-widest text-rose-500 ml-1" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex items-center justify-end gap-6 pt-10 border-t border-white/20 dark:border-slate-800/50">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                  className="rounded-xl h-12 px-8 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95"
                >
                  Cancel Session
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="rounded-2xl h-14 min-w-[220px] px-10 bg-primary-custom text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-primary-custom/20 hover:shadow-primary-custom/40 transition-all active:scale-[0.98] disabled:opacity-50 border-none"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Spawning...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      {isEdit ? "Update Ingredient" : "Create Ingredient"}
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

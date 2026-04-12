"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Save, Truck, Info, MapPin, Globe, CreditCard, ShieldCheck, RefreshCw } from "lucide-react";
import { getShippingConfigs, updateShippingConfig } from "@/action/shipping/shipping.action";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

const configSchema = z.object({
  id: z.string(),
  zoneName: z.string(),
  charge: z.number().min(0, "Charge must be at least 0"),
  description: z.string().optional(),
});

type ConfigValues = z.infer<typeof configSchema>;

export function ShippingSettings() {
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [configs, setConfigs] = useState<ConfigValues[]>([]);

  const fetchConfigs = async () => {
    setIsLoading(true);
    const result = await getShippingConfigs();
    if (result.success && result.data) {
      setConfigs(result.data);
    } else {
      toast.error("Failed to load shipping configurations.");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const handleUpdate = async (id: string, values: ConfigValues) => {
    setIsUpdating(id);
    const result = await updateShippingConfig(id, {
      charge: values.charge,
      description: values.description,
    });

    if (result.success) {
      toast.success(`Successfully updated ${values.zoneName.replace('_', ' ')}`);
      fetchConfigs();
    } else {
      toast.error(result.message || "Failed to update configuration");
    }
    setIsUpdating(null);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-8 animate-in fade-in duration-700">
         <div className="relative">
            <div className="absolute inset-0 bg-primary-custom/20 blur-3xl rounded-full scale-150" />
            <div className="relative h-20 w-20 rounded-[2rem] bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl border border-white/40 flex items-center justify-center">
              <RefreshCw className="h-10 w-10 animate-spin text-primary-custom" />
            </div>
         </div>
         <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Synchronizing Logistics</span>
            <p className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Accessing Cloud Assets...</p>
         </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-1000">
      {/* Header Island */}
      <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-10 rounded-[3rem] border border-white/40 dark:border-slate-800/50 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
          <Truck className="h-48 w-48" />
        </div>
        
        <div className="space-y-2 relative z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-custom/10 border border-primary-custom/20 mb-2">
            <ShieldCheck className="h-3.5 w-3.5 text-primary-custom" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary-custom">Security Level High</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase leading-none">
            Shipping Matrix
          </h1>
          <p className="text-sm font-medium text-slate-500 max-w-md">
            Configure global and domestic logistics, delivery tariffs, and zone-specific descriptions for real-time checkout calculations.
          </p>
        </div>

        <div className="flex items-center gap-4 relative z-10">
           <div className="flex flex-col items-end mr-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Zones</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">{configs.length}</span>
           </div>
           <Button 
            variant="outline" 
            size="lg" 
            onClick={fetchConfigs}
            className="rounded-[1.5rem] h-14 px-8 border-white/40 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md hover:bg-white dark:hover:bg-slate-800 transition-all active:scale-95 font-black uppercase tracking-widest text-[10px]"
           >
             Refetch Data
           </Button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {configs.map((config) => (
          <ShippingZoneCard
            key={config.id}
            config={config}
            isUpdating={isUpdating === config.id}
            onSave={(values) => handleUpdate(config.id, values)}
          />
        ))}
      </div>

      {configs.length === 0 && !isLoading && (
        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-20 rounded-[3rem] border border-white/40 dark:border-slate-800/50 flex flex-col items-center justify-center gap-6 text-center">
            <div className="h-24 w-24 rounded-[2.5rem] bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-800 shadow-inner">
               <Truck className="h-10 w-10 text-slate-400" />
            </div>
            <div className="space-y-2">
               <p className="text-xl font-black uppercase tracking-tight text-slate-400">Empty Logistics Domain</p>
               <p className="text-sm font-medium text-slate-500 max-w-xs mx-auto">No shipping zones found. They will be initialized on first system access or manual trigger.</p>
            </div>
            <Button 
              variant="outline" 
              className="mt-4 rounded-2xl h-12 px-8 font-black uppercase tracking-widest text-[10px] border-slate-200 dark:border-slate-800"
              onClick={fetchConfigs}
            >
              Initialize Defaults
            </Button>
        </div>
      )}
    </div>
  );
}

interface ShippingZoneCardProps {
  config: ConfigValues;
  isUpdating: boolean;
  onSave: (values: ConfigValues) => void;
}

function ShippingZoneCard({ config, isUpdating, onSave }: ShippingZoneCardProps) {
  const form = useForm<ConfigValues>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      id: config.id,
      zoneName: config.zoneName,
      charge: config.charge,
      description: config.description || "",
    },
  });

  return (
    <Card className="overflow-hidden bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/40 dark:border-slate-800/50 shadow-sm relative group/card transition-all duration-700 hover:shadow-2xl hover:shadow-primary-custom/5">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover/card:opacity-10 transition-opacity duration-700 pointer-events-none">
        <MapPin className="h-24 w-24" />
      </div>

      <CardHeader className="p-8 pb-4 relative z-10">
        <div className="flex items-center justify-between mb-2">
           <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary-custom/10 dark:bg-primary-custom/20 flex items-center justify-center border border-primary-custom/20 shadow-sm group-hover/card:scale-110 transition-transform duration-500">
                <Truck className="h-5 w-5 text-primary-custom" />
              </div>
              <div>
                <CardTitle className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
                  {config.zoneName.replace('_', ' ')}
                </CardTitle>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 -mt-1 block">Geo Configuration</span>
              </div>
           </div>
           <Globe className="h-5 w-5 text-slate-300 dark:text-slate-700 group-hover/card:text-primary-custom transition-colors duration-500" />
        </div>
        <CardDescription className="font-medium text-slate-500 dark:text-slate-400 mt-2">
           Manage deployment costs and operational limits for this regional zone.
        </CardDescription>
      </CardHeader>

      <Separator className="mx-8 bg-slate-100/50 dark:bg-slate-800/30" />

      <CardContent className="p-8 pt-6 relative z-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">
            <FormField
              control={form.control}
              name="charge"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between mb-2">
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                       <CreditCard className="h-3 w-3" /> Delivery Charge (৳)
                    </FormLabel>
                    <FormMessage className="text-[10px] font-bold" />
                  </div>
                  <FormControl>
                    <div className="relative group/input">
                       <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <span className="text-slate-400 font-bold text-lg">৳</span>
                       </div>
                       <Input
                        type="number"
                        placeholder="e.g. 60"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        disabled={isUpdating}
                        className="pl-10 h-16 bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border-primary/40 dark:border-primary/40 rounded-2xl shadow-inner focus-visible:ring-primary-custom/30 text-xl font-black text-slate-900 dark:text-white transition-all duration-500"
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between mb-2">
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                       <Info className="h-3 w-3" /> Territorial Limits
                    </FormLabel>
                    <FormMessage className="text-[10px] font-bold" />
                  </div>
                  <FormControl>
                    <Input
                      placeholder="e.g. Inside Dhaka areas"
                      {...field}
                      disabled={isUpdating}
                      className="h-16 bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border-primary/40 dark:border-primary/40 rounded-2xl shadow-inner focus-visible:ring-primary-custom/30 font-bold text-slate-700 dark:text-slate-300 transition-all duration-500"
                    />
                  </FormControl>
                  <FormDescription className="text-[10px] font-medium text-slate-400 uppercase tracking-tight">
                    Specify the geographical boundaries for this logistic tier.
                  </FormDescription>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isUpdating || !form.formState.isDirty}
              className="w-full h-16 rounded-[1.5rem] bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-primary-custom dark:hover:bg-primary-custom dark:hover:text-white transition-all duration-500 shadow-xl shadow-slate-900/10 active:scale-[0.98]"
            >
              {isUpdating ? (
                <Loader2 className="mr-3 h-5 w-5 animate-spin" />
              ) : (
                <Save className="mr-3 h-5 w-5" />
              )}
              {isUpdating ? "Processing Matrix..." : "Commit Changes"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

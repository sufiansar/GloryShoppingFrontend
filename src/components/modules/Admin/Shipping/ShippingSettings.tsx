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
import { Loader2, Save, Truck, Info } from "lucide-react";
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
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading shipping settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
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
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-10 opacity-60">
            <Truck className="h-12 w-12 mb-2" />
            <p>No shipping zones found. They will be initialized on first load.</p>
            <Button variant="outline" className="mt-4" onClick={fetchConfigs}>
              Initialize Defaults
            </Button>
          </CardContent>
        </Card>
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

  const baseColor = "oklch(52.801% 0.15987 344.323)";

  return (
    <Card className="overflow-hidden shadow-md border-0 bg-white/80 backdrop-blur">
      <div 
        className="h-1.5 w-full" 
        style={{ background: `linear-gradient(90deg, ${baseColor}, #db2777)` }}
      />
      <CardHeader>
        <CardTitle className="flex items-center gap-2" style={{ color: baseColor }}>
          <Truck className="h-5 w-5" />
          {config.zoneName.replace('_', ' ')}
        </CardTitle>
        <CardDescription>
          Management delivery charge for this zone
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
            <FormField
              control={form.control}
              name="charge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Charge (৳)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="e.g. 60" 
                      {...field} 
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      disabled={isUpdating}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. Inside Dhaka areas" 
                      {...field} 
                      disabled={isUpdating}
                    />
                  </FormControl>
                  <FormDescription>
                    Briefly describe which areas this zone covers
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full mt-4" 
              disabled={isUpdating || !form.formState.isDirty}
              style={{ backgroundColor: baseColor }}
            >
              {isUpdating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {isUpdating ? "Updating..." : "Save Changes"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

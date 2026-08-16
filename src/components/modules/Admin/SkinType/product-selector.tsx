import React from"react";
import { Check, ChevronsUpDown } from"lucide-react";
import { cn } from"@/lib/utils";
import { Button } from"@/components/ui/button";
import {
 Command,
 CommandEmpty,
 CommandGroup,
 CommandInput,
 CommandItem,
} from"@/components/ui/command";
import {
 Popover,
 PopoverContent,
 PopoverTrigger,
} from"@/components/ui/popover";
import { Badge } from"@/components/ui/badge";
import { ScrollArea } from"@/components/ui/scroll-area";

interface Product {
 id: string;
 name: string;
 description?: string;
 price: number;
}

interface ProductSelectorProps {
 products: Product[];
 selectedProducts: string[];
 onSelectionChange: (selectedIds: string[]) => void;
 isLoading?: boolean;
 disabled?: boolean;
}

export function ProductSelector({
 products,
 selectedProducts,
 onSelectionChange,
 isLoading = false,
 disabled = false,
}: ProductSelectorProps) {
 const [open, setOpen] = React.useState(false);

 const toggleProduct = (productId: string) => {
 if (selectedProducts.includes(productId)) {
 onSelectionChange(selectedProducts.filter((id) => id !== productId));
 } else {
 onSelectionChange([...selectedProducts, productId]);
 }
 };

 const getSelectedProductNames = () => {
 return selectedProducts
 .map((id) => products.find((p) => p.id === id)?.name)
 .filter(Boolean) as string[];
 };

 if (isLoading) {
 return (
 <div className="space-y-2">
 <div className="h-10 bg-gray-100 rounded animate-pulse"/>
 <div className="flex flex-wrap gap-2">
 {[1, 2, 3].map((i) => (
 <div
 key={i}
 className="h-6 bg-gray-100 rounded-full animate-pulse w-24"
 />
 ))}
 </div>
 </div>
 );
 }

 return (
 <div className="space-y-3">
 <Popover open={open} onOpenChange={setOpen}>
 <PopoverTrigger asChild>
 <Button
 variant="outline"
 role="combobox"
 aria-expanded={open}
 className="w-full justify-between"
 disabled={disabled || products.length === 0}
 >
 <span className="truncate">
 {selectedProducts.length > 0
 ? `${selectedProducts.length} product(s) selected`
 :"Select products..."}
 </span>
 <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
 </Button>
 </PopoverTrigger>
 <PopoverContent className="w-full p-0">
 <Command>
 <CommandInput placeholder="Search products..."/>
 <CommandEmpty>No products found.</CommandEmpty>
 <CommandGroup>
 <ScrollArea className="h-64">
 {products.map((product) => (
 <CommandItem
 key={product.id}
 onSelect={() => toggleProduct(product.id)}
 >
 <Check
 className={cn(
"mr-2 h-4 w-4",
 selectedProducts.includes(product.id)
 ?"opacity-100"
 :"opacity-0",
 )}
 />
 <div className="flex flex-col">
 <span className="font-medium">{product.name}</span>
 <span className="text-xs text-gray-500">
 ${product.price.toFixed(2)}
 </span>
 </div>
 </CommandItem>
 ))}
 </ScrollArea>
 </CommandGroup>
 </Command>
 </PopoverContent>
 </Popover>

 {/* Selected Products Badges */}
 {selectedProducts.length > 0 && (
 <div className="flex flex-wrap gap-2 p-2 border rounded-md">
 {getSelectedProductNames().map((name, index) => (
 <Badge key={index} variant="secondary"className="gap-1">
 {name}
 <button
 type="button"
 onClick={() =>
 toggleProduct(products.find((p) => p.name === name)?.id ||"")
 }
 className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
 >
 ×
 </button>
 </Badge>
 ))}
 </div>
 )}
 </div>
 );
}

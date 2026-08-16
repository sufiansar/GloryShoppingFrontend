// components/section/SectionManagement.tsx
"use client";

import React, { useState, useEffect } from"react";
import { Button } from"@/components/ui/button";
import { Input } from"@/components/ui/input";
import { Badge } from"@/components/ui/badge";
import {
 Card,
 CardContent,
 CardDescription,
 CardHeader,
 CardTitle,
} from"@/components/ui/card";
import {
 Table,
 TableBody,
 TableCell,
 TableHead,
 TableHeader,
 TableRow,
} from"@/components/ui/table";
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,
 DropdownMenuLabel,
 DropdownMenuSeparator,
 DropdownMenuTrigger,
} from"@/components/ui/dropdown-menu";
import {
 Dialog,
 DialogContent,
 DialogDescription,
 DialogHeader,
 DialogTitle,
 DialogTrigger,
} from"@/components/ui/dialog";
import {
 AlertDialog,
 AlertDialogAction,
 AlertDialogCancel,
 AlertDialogContent,
 AlertDialogDescription,
 AlertDialogFooter,
 AlertDialogHeader,
 AlertDialogTitle,
} from"@/components/ui/alert-dialog";
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from"@/components/ui/select";
import { Skeleton } from"@/components/ui/skeleton";
import {
 Plus,
 Search,
 MoreVertical,
 Eye,
 EyeOff,
 Edit,
 Trash2,
 Image as ImageIcon,
 RefreshCw,
 Filter,
 Download,
 Upload,
 ChevronDown,
 ExternalLink,
 Calendar,
 FileText,
} from"lucide-react";
import { toast } from"sonner";
import { getSections, deleteSection } from"@/action/section/section.action";
import { Section, SECTION_TYPE } from"@/types/section.interface";

import {
 Tooltip,
 TooltipContent,
 TooltipProvider,
 TooltipTrigger,
} from"@/components/ui/tooltip";
import { format } from"date-fns";
import Image from"next/image";
import CreateSectionForm from"../../Sections/SectionsCreate";
import UpdateSectionForm from"../../Sections/UpdateSectionForm";
import Pagination from"@/components/Shared/Pagination";

interface SectionManagementProps {
 initialSections?: Section[];
}

export default function SectionManagement({
 initialSections = [],
}: SectionManagementProps) {
 const [sections, setSections] = useState<Section[]>(initialSections);
 const [filteredSections, setFilteredSections] = useState<Section[]>([]);
 const [isLoading, setIsLoading] = useState(!initialSections.length);
 const [searchQuery, setSearchQuery] = useState("");
 const [statusFilter, setStatusFilter] = useState<string>("all");
 const [typeFilter, setTypeFilter] = useState<string>("all");
 const [selectedSection, setSelectedSection] = useState<Section | null>(null);
 const [showCreateDialog, setShowCreateDialog] = useState(false);
 const [showEditDialog, setShowEditDialog] = useState(false);
 const [showDeleteDialog, setShowDeleteDialog] = useState(false);
 const [showViewDialog, setShowViewDialog] = useState(false);
 const [sectionToDelete, setSectionToDelete] = useState<string | null>(null);
 const [viewSection, setViewSection] = useState<Section | null>(null);

 // Fetch sections
 const fetchSections = async () => {
 try {
 setIsLoading(true);
 const data = await getSections();

 setFilteredSections(data?.data);
 } catch (error) {
 toast.error("Failed to fetch sections");
 console.error(error);
 } finally {
 setIsLoading(false);
 }
 };

 useEffect(() => {
 if (!initialSections.length) {
 fetchSections();
 } else {
 setSections(initialSections);
 setFilteredSections(initialSections);
 }
 }, [initialSections]);

 // Apply filters
 useEffect(() => {
 let result = sections;

 // Search filter
 if (searchQuery) {
 result = result.filter(
 (section) =>
 section.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
 section.description
 ?.toLowerCase()
 .includes(searchQuery.toLowerCase()) ||
 section.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
 section.ctaText?.toLowerCase().includes(searchQuery.toLowerCase()),
 );
 }

 // Status filter
 if (statusFilter !=="all") {
 const isVisible = statusFilter ==="visible";
 result = result.filter((section) => section.isVisible === isVisible);
 }

 // Type filter
 if (typeFilter !=="all") {
 result = result.filter((section) => section.type === typeFilter);
 }

 setFilteredSections(result);
 }, [searchQuery, statusFilter, typeFilter, sections]);

 // Handle delete section
 const handleDeleteSection = async () => {
 if (!sectionToDelete) return;

 try {
 await deleteSection(sectionToDelete);
 toast.success("Section deleted successfully");
 fetchSections();
 setShowDeleteDialog(false);
 setSectionToDelete(null);
 } catch (error) {
 toast.error("Failed to delete section");
 console.error(error);
 }
 };

 // Handle edit section
 const handleEditClick = (section: Section) => {
 setSelectedSection(section);
 setShowEditDialog(true);
 };

 // Handle view section
 const handleViewClick = (section: Section) => {
 setViewSection(section);
 setShowViewDialog(true);
 };

 // Handle delete click
 const handleDeleteClick = (id: string) => {
 setSectionToDelete(id);
 setShowDeleteDialog(true);
 };

 const getSectionTypeBadge = (type: SECTION_TYPE) => {
 const types = {
 [SECTION_TYPE.HERO]: { label:"Hero", variant:"default"as const },
 [SECTION_TYPE.PROMOTIONAL]: {
 label:"Promo",
 variant:"secondary"as const,
 },
 [SECTION_TYPE.BENEFITS]: {
 label:"Benefits",
 variant:"outline"as const,
 },
 [SECTION_TYPE.NEW_ARRIVALS]: {
 label:"New Arrivals",
 variant:"destructive"as const,
 },
 };
 return types[type] || { label: type, variant:"default"as const };
 };

 // Format date
 const formatDate = (dateString?: string) => {
 if (!dateString) return"N/A";
 try {
 return format(new Date(dateString),"MMM dd, yyyy");
 } catch {
 return dateString;
 }
 };

 // Handle section created
 const handleSectionCreated = () => {
 fetchSections();
 setShowCreateDialog(false);
 toast.success("Section created successfully");
 };

 // Handle section updated
 const handleSectionUpdated = () => {
 fetchSections();
 setShowEditDialog(false);
 toast.success("Section updated successfully");
 };

 return (
 <div className="space-y-8 animate-in fade-in duration-700">
 {/* Premium Header Card */}
 <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/40 dark:border-slate-800/50 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
 <div>
 <h1 className="text-2xl font-medium text-slate-900 dark:text-white">
 Section Management
 </h1>
 <p className="text-sm font-medium text-slate-400 mt-2">
 Create, edit, and manage your website home page sections
 </p>
 </div>
 <div className="flex items-center gap-3">
 <Button
 variant="outline"
 onClick={fetchSections}
 disabled={isLoading}
 className="rounded-2xl h-12 px-6 border-white/40 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl hover:bg-white/60 dark:hover:bg-slate-800/60 text-sm font-medium text-slate-600 dark:text-slate-300 transition-all shadow-sm"
 >
 <RefreshCw
 className={`h-4 w-4 mr-2 text-primary-custom ${isLoading ?"animate-spin":""}`}
 />
 Refresh
 </Button>

 <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
 <DialogTrigger asChild>
 <Button className="rounded-2xl h-12 px-8 bg-primary-custom text-white font-medium text-sm shadow-lg shadow-primary-custom/20 hover:shadow-primary-custom/40 transition-all border-none">
 <Plus className="h-4 w-4 mr-2"/>
 Create Section
 </Button>
 </DialogTrigger>
 <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto premium-glass-dialog p-0 border-none">
 <div className="p-8 space-y-6">
 <DialogHeader>
 <DialogTitle className="text-2xl font-medium">Create New Section</DialogTitle>
 <DialogDescription className="font-medium text-slate-500">
 Add a new section to your website. Fill in the required fields.
 </DialogDescription>
 </DialogHeader>
 <div className="bg-white/30 dark:bg-slate-800/30 rounded-3xl p-6 border border-white/20">
 {React.createElement(
 CreateSectionForm as React.ComponentType<any>,
 {
 onSuccess: handleSectionCreated,
 },
 )}
 </div>
 </div>
 </DialogContent>
 </Dialog>
 </div>
 </div>


 {/* Stats Cards - Bento Style */}
 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
 <Card className="border-none bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2rem] shadow-sm group hover:shadow-md transition-all duration-500 border border-white/20 overflow-hidden">
 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
 <FileText className="h-16 w-16"/>
 </div>
 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
 <CardTitle className="text-sm font-medium text-slate-400">
 Total Sections
 </CardTitle>
 </CardHeader>
 <CardContent className="relative z-10">
 <div className="text-4xl font-medium text-slate-900 dark:text-white er mb-1">{sections.length}</div>
 <p className="text-sm font-bold text-slate-400">
 System Total
 </p>
 </CardContent>
 </Card>
 <Card className="border-none bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2rem] shadow-sm group hover:shadow-md transition-all duration-500 border border-white/20 overflow-hidden">
 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-emerald-500">
 <Eye className="h-16 w-16"/>
 </div>
 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
 <CardTitle className="text-sm font-medium text-slate-400">Visible</CardTitle>
 </CardHeader>
 <CardContent className="relative z-10">
 <div className="text-4xl font-medium text-emerald-500 er mb-1">
 {
 (Array.isArray(sections) ? sections : []).filter(
 (s) => s?.isVisible,
 ).length
 }
 </div>
 <p className="text-sm font-bold text-slate-400">
 Live Assets
 </p>
 </CardContent>
 </Card>
 <Card className="border-none bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2rem] shadow-sm group hover:shadow-md transition-all duration-500 border border-white/20 overflow-hidden">
 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-primary-custom">
 <ImageIcon className="h-16 w-16"/>
 </div>
 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
 <CardTitle className="text-sm font-medium text-slate-400">Hero Sections</CardTitle>
 </CardHeader>
 <CardContent className="relative z-10">
 <div className="text-4xl font-medium text-primary-custom er mb-1">
 {
 (Array.isArray(sections) ? sections : []).filter(
 (s) => s.type === SECTION_TYPE.HERO,
 ).length
 }
 </div>
 <p className="text-sm font-bold text-slate-400">
 Prime Spots
 </p>
 </CardContent>
 </Card>
 <Card className="border-none bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2rem] shadow-sm group hover:shadow-md transition-all duration-500 border border-white/20 overflow-hidden">
 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-primary-custom">
 <ImageIcon className="h-16 w-16"/>
 </div>
 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
 <CardTitle className="text-sm font-medium text-slate-400">Images</CardTitle>
 </CardHeader>
 <CardContent className="relative z-10">
 <div className="text-4xl font-medium text-primary-custom er mb-1">
 {(Array.isArray(sections) ? sections : []).reduce(
 (acc, s) => acc + (s.images?.length || 0),
 0,
 )}
 </div>
 <p className="text-sm font-bold text-slate-400">
 Gallery Total
 </p>
 </CardContent>
 </Card>
 </div>

 {/* Filter & Command Center */}
 <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/40 dark:border-slate-800/50 shadow-sm space-y-6">
 <div className="flex flex-col md:flex-row gap-4">
 <div className="flex-1 relative group">
 <div className="absolute inset-0 bg-primary-custom/5 blur-xl group-focus-within:bg-primary-custom/10 transition-all duration-500 rounded-3xl"/>
 <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 group-focus-within:text-primary-custom transition-colors"/>
 <Input
 placeholder="Search sections..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="pl-12 h-14 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-white/20 dark:border-slate-800/50 rounded-2xl shadow-sm focus-visible:ring-primary-custom/30 focus-visible:border-primary-custom/50 transition-all duration-500 font-medium relative z-10"
 />
 </div>
 <div className="flex gap-3">
 <Select value={statusFilter} onValueChange={setStatusFilter}>
 <SelectTrigger className="h-14 w-[160px] bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl border-primary/40 dark:border-primary/40 font-bold text-slate-600 dark:text-slate-300">
 <SelectValue placeholder="Status"/>
 </SelectTrigger>
 <SelectContent className="rounded-2xl border-slate-200 dark:border-slate-800 backdrop-blur-3xl bg-white/80 dark:bg-slate-900/80 p-2">
 <SelectItem value="all"className="rounded-xl font-bold">All Status</SelectItem>
 <SelectItem value="visible"className="rounded-xl font-bold text-emerald-500">Visible</SelectItem>
 <SelectItem value="hidden"className="rounded-xl font-bold text-slate-400">Hidden</SelectItem>
 </SelectContent>
 </Select>

 <Select value={typeFilter} onValueChange={setTypeFilter}>
 <SelectTrigger className="h-14 w-[180px] bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl border-primary/40 dark:border-primary/40 font-bold text-slate-600 dark:text-slate-300">
 <SelectValue placeholder="Type"/>
 </SelectTrigger>
 <SelectContent className="rounded-2xl border-slate-200 dark:border-slate-800 backdrop-blur-3xl bg-white/80 dark:bg-slate-900/80 p-2">
 <SelectItem value="all"className="rounded-xl font-bold">All Types</SelectItem>
 <SelectItem value={SECTION_TYPE.HERO} className="rounded-xl font-bold">Hero</SelectItem>
 <SelectItem value={SECTION_TYPE.PROMOTIONAL} className="rounded-xl font-bold">Promotional</SelectItem>
 <SelectItem value={SECTION_TYPE.BENEFITS} className="rounded-xl font-bold">Benefits</SelectItem>
 <SelectItem value={SECTION_TYPE.NEW_ARRIVALS} className="rounded-xl font-bold">New Arrivals</SelectItem>
 </SelectContent>
 </Select>

 <Button
 variant="outline"
 size="icon"
 className="h-14 w-14 rounded-2xl border-white/20 dark:border-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-all active:scale-90"
 onClick={() => {
 setSearchQuery("");
 setStatusFilter("all");
 setTypeFilter("all");
 }}
 >
 <Filter className="h-5 w-5 text-slate-400"/>
 </Button>
 </div>
 </div>
 </div>

 {/* Sections Table - Intelligent List */}
 <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/40 dark:border-slate-800/50 shadow-sm overflow-hidden">
 <div className="overflow-x-auto scrollbar-premium">
 <Table>
 <TableHeader>
 <TableRow className="border-b border-slate-200/30 dark:border-slate-800/30 hover:bg-transparent px-6 text-left">
 <TableHead className="w-24 py-6 pl-8 text-sm font-medium text-slate-400">Visual</TableHead>
 <TableHead className="py-6 text-sm font-medium text-slate-400">Title</TableHead>
 <TableHead className="py-6 text-sm font-medium text-slate-400">Type</TableHead>
 <TableHead className="py-6 text-sm font-medium text-slate-400">Gallery</TableHead>
 <TableHead className="py-6 text-sm font-medium text-slate-400">Status</TableHead>
 <TableHead className="text-right py-6 pr-8 text-sm font-medium text-slate-400">Actions</TableHead>
 </TableRow>
 </TableHeader>
 <TableBody>
 {isLoading ? (
 <TableRow>
 <TableCell colSpan={6} className="text-center py-20">
 <div className="flex flex-col items-center gap-4 animate-pulse">
 <div className="h-12 w-12 rounded-2xl bg-slate-200/50 dark:bg-slate-800/50 flex items-center justify-center">
 <RefreshCw className="h-6 w-6 animate-spin text-primary-custom"/>
 </div>
 <span className="text-sm font-medium text-slate-400">Accessing Cloud Assets...</span>
 </div>
 </TableCell>
 </TableRow>
 ) : filteredSections?.length === 0 ? (
 <TableRow>
 <TableCell colSpan={6} className="text-center py-20">
 <div className="flex flex-col items-center gap-2">
 <span className="text-sm font-medium text-slate-400">Empty Domain: No Sections Sequenced</span>
 </div>
 </TableCell>
 </TableRow>
 ) : (
 filteredSections?.map((section) => {
 const typeBadge = getSectionTypeBadge(section.type);
 return (
 <TableRow key={section.id} className="premium-table-row border-b border-slate-100/30 dark:border-slate-800/20 group/row">
 <TableCell className="py-5 pl-8">
 <div className="relative h-14 w-24 rounded-2xl overflow-hidden shadow-sm ring-2 ring-white/50 dark:ring-slate-800/50 group-hover/row:scale-105 transition-transform duration-500">
 {section.images?.[0] ? (
 <Image
 src={section.images[0]}
 alt={section.title ||"Section"}
 fill
 className="object-cover"
 sizes="120px"
 />
 ) : (
 <div className="h-full w-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
 <ImageIcon className="h-5 w-5 text-slate-300"/>
 </div>
 )}
 </div>
 </TableCell>
 <TableCell>
 <div className="flex flex-col max-w-xs">
 <span className="text-sm font-medium text-slate-900 dark:text-white group-hover/row:text-primary-custom transition-colors truncate">
 {section.title ||"Untitled Section"}
 </span>
 {section.description && (
 <span className="text-sm font-bold text-slate-400 truncate opacity-70">
 {section.description}
 </span>
 )}
 </div>
 </TableCell>
 <TableCell>
 <div className={`inline-flex items-center px-3 py-1 rounded-xl font-medium text-[9px] border border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-800/50 shadow-xs`}>
 {typeBadge.label}
 </div>
 </TableCell>
 <TableCell>
 <div className="flex items-center gap-3">
 <div className="flex -space-x-2">
 {section.images?.slice(0, 3).map((img, i) => (
 <div key={i} className="h-7 w-7 rounded-lg ring-2 ring-white dark:ring-slate-900 overflow-hidden bg-slate-100">
 <Image src={img} alt=""width={28} height={28} className="object-cover"/>
 </div>
 ))}
 {(section.images?.length || 0) > 3 && (
 <div className="h-7 w-7 rounded-lg ring-2 ring-white dark:ring-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[8px] font-medium">
 +{section.images!.length - 3}
 </div>
 )}
 </div>
 <span className="text-sm font-medium text-slate-400 er">
 {section.images?.length || 0} Assets
 </span>
 </div>
 </TableCell>
 <TableCell>
 <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${section.isVisible ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-600' : 'bg-slate-500/5 border-slate-500/20 text-slate-500'}`}>
 <div className={`w-1.5 h-1.5 rounded-full ${section.isVisible ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-400'}`} />
 <span className="text-[9px] font-medium">
 {section.isVisible ?"Visible":"Hidden"}
 </span>
 </div>
 </TableCell>
 <TableCell className="text-right pr-8">
 <DropdownMenu>
 <DropdownMenuTrigger asChild>
 <Button variant="ghost"size="icon"className="h-10 w-10 hover:bg-white dark:hover:bg-slate-800 rounded-xl shadow-sm transition-all active:scale-90">
 <MoreVertical className="h-5 w-5 text-slate-400"/>
 </Button>
 </DropdownMenuTrigger>
 <DropdownMenuContent align="end"className="w-56 p-2 rounded-2xl border-white/20 dark:border-slate-800/50 backdrop-blur-3xl glass-card">
 <DropdownMenuLabel className="text-sm font-medium text-slate-400 px-3 py-2">Operations</DropdownMenuLabel>
 <DropdownMenuItem
 onClick={() => handleViewClick(section)}
 className="flex items-center gap-3 p-3 rounded-xl focus:bg-primary-custom/10 focus:text-primary-custom transition-all cursor-pointer font-bold"
 >
 <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
 <Eye className="h-4 w-4 text-blue-500"/>
 </div>
 View Details
 </DropdownMenuItem>
 <DropdownMenuItem
 onClick={() => handleEditClick(section)}
 className="flex items-center gap-3 p-3 rounded-xl focus:bg-primary-custom/10 focus:text-primary-custom transition-all cursor-pointer font-bold"
 >
 <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
 <Edit className="h-4 w-4 text-amber-500"/>
 </div>
 Edit
 </DropdownMenuItem>
 <DropdownMenuSeparator className="mx-2 bg-slate-100 dark:bg-slate-800/50"/>
 <DropdownMenuItem
 onClick={() => handleDeleteClick(section.id)}
 className="flex items-center gap-3 p-3 rounded-xl focus:bg-rose-500/10 focus:text-rose-500 transition-all cursor-pointer font-bold text-rose-500"
 >
 <div className="h-8 w-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
 <Trash2 className="h-4 w-4"/>
 </div>
 Delete
 </DropdownMenuItem>
 </DropdownMenuContent>
 </DropdownMenu>
 </TableCell>
 </TableRow>
 );
 })
 )}
 </TableBody>
 </Table>
 </div>
 </div>

 {/* Pagination */}
 <Pagination
 currentPage={1}
 totalPages={1}
 totalItems={filteredSections.length}
 itemsPerPage={filteredSections.length || 10}
 className="mt-6"
 showItemsPerPage={false}
 />

 {/* View Section Dialog - Premium Static Static */}
 <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
 <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto premium-glass-dialog p-0 border-none">
 {viewSection && (
 <div className="p-8 space-y-8">
 <DialogHeader>
 <DialogTitle className="text-2xl font-medium text-slate-900 dark:text-white">Section Details</DialogTitle>
 <DialogDescription className="font-medium text-slate-500">
 View detailed information about this section
 </DialogDescription>
 </DialogHeader>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
 {/* Images Column */}
 <div className="md:col-span-1 space-y-4">
 <h4 className="text-sm font-medium text-slate-400">Cloud Assets ({viewSection.images?.length || 0})</h4>
 <div className="grid grid-cols-2 gap-3">
 {viewSection.images?.map((image, index) => (
 <div key={index} className="relative group/asset shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 rounded-2xl overflow-hidden aspect-square">
 <Image
 src={image}
 alt={`Asset ${index + 1}`}
 fill
 className="object-cover"
 />
 {index === 0 && (
 <Badge className="absolute top-2 left-2 bg-primary-custom text-[8px] font-medium">Main</Badge>
 )}
 </div>
 ))}
 </div>
 </div>

 {/* Details Column */}
 <div className="md:col-span-2 space-y-8">
 <div className="flex flex-col gap-4 bg-white/30 dark:bg-slate-800/20 p-6 rounded-3xl border border-white/20">
 <div className="flex items-center justify-between">
 <h3 className="text-xl font-medium text-slate-900 dark:text-white">
 {viewSection.title ||"Untitled Section"}
 </h3>
 <Badge
 variant={getSectionTypeBadge(viewSection.type).variant}
 className="font-medium text-[9px] rounded-xl"
 >
 {getSectionTypeBadge(viewSection.type).label}
 </Badge>
 </div>
 <p className="text-sm font-medium text-slate-500 leading-relaxed">
 {viewSection.description ||"No description provided"}
 </p>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
 <div className="space-y-4">
 <div className="space-y-1">
 <span className="text-sm font-medium text-slate-400">Call to Action</span>
 <p className="text-sm font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/50 px-4 py-3 rounded-2xl">
 {viewSection.ctaText ||"Not configured"}
 </p>
 </div>
 <div className="space-y-1">
 <span className="text-sm font-medium text-slate-400">Destination Link</span>
 <div className="bg-slate-100 dark:bg-slate-800/50 px-4 py-3 rounded-2xl group/link">
 {viewSection.link ? (
 <a
 href={viewSection.link}
 target="_blank"
 rel="noopener noreferrer"
 className="text-xs font-bold text-blue-500 hover:text-blue-600 truncate block flex items-center gap-2"
 >
 {viewSection.link}
 <ExternalLink className="h-3 w-3"/>
 </a>
 ) : (
 <p className="text-xs font-bold text-slate-400">Not configured</p>
 )}
 </div>
 </div>
 </div>

 <div className="space-y-6">
 <div className="space-y-3">
 <span className="text-sm font-medium text-slate-400">System Visualization</span>
 <div className="flex gap-4">
 {viewSection.primaryColor && (
 <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
 <div className="h-6 w-6 rounded-lg ring-1 ring-white/20"style={{ backgroundColor: viewSection.primaryColor }} />
 <span className="text-sm font-bold font-mono">{viewSection.primaryColor}</span>
 </div>
 )}
 {viewSection.secondaryColor && (
 <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
 <div className="h-6 w-6 rounded-lg ring-1 ring-white/20"style={{ backgroundColor: viewSection.secondaryColor }} />
 <span className="text-sm font-bold font-mono">{viewSection.secondaryColor}</span>
 </div>
 )}
 </div>
 </div>

 <div className="space-y-3">
 <span className="text-sm font-medium text-slate-400">Visibility State</span>
 <div className={`px-4 py-2 rounded-2xl border w-fit font-medium text-sm ${viewSection.isVisible ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' : 'bg-slate-500/10 border-slate-500/20 text-slate-500'}`}>
 {viewSection.isVisible ?"Public Display":"Private Archive"}
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 )}
 </DialogContent>
 </Dialog>

 <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
 <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto premium-glass-dialog p-0 border-none">
 <div className="p-8 space-y-6">
 <DialogHeader>
 <DialogTitle className="text-2xl font-medium text-slate-900 dark:text-white">Edit Section</DialogTitle>
 <DialogDescription className="font-medium text-slate-500">
 Update the section details and images
 </DialogDescription>
 </DialogHeader>
 <div className="bg-white/30 dark:bg-slate-800/30 rounded-3xl p-6 border border-white/20">
 {selectedSection &&
 React.createElement(UpdateSectionForm as React.ComponentType<any>, {
 section: selectedSection,
 onSuccess: handleSectionUpdated,
 })}
 </div>
 </div>
 </DialogContent>
 </Dialog>

 <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
 <AlertDialogContent className="rounded-[2.5rem] premium-glass-dialog border-none p-8">
 <AlertDialogHeader>
 <AlertDialogTitle className="text-2xl font-medium text-slate-900 dark:text-white">Are you absolutely sure?</AlertDialogTitle>
 <AlertDialogDescription className="font-medium text-slate-500">
 This action cannot be undone. This will permanently delete the section and remove all associated data from our servers.
 </AlertDialogDescription>
 </AlertDialogHeader>
 <AlertDialogFooter className="mt-8">
 <AlertDialogCancel className="rounded-2xl border-slate-200 dark:border-slate-800 font-bold text-sm py-4">Cancel</AlertDialogCancel>
 <AlertDialogAction
 onClick={handleDeleteSection}
 className="bg-rose-500 text-white hover:bg-rose-600 rounded-2xl font-bold text-sm py-4"
 >
 Delete
 </AlertDialogAction>
 </AlertDialogFooter>
 </AlertDialogContent>
 </AlertDialog>
 </div>
 );
}

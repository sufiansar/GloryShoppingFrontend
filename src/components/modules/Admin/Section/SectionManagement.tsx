// components/section/SectionManagement.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
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
} from "lucide-react";
import { toast } from "sonner";
import { getSections, deleteSection } from "@/action/section/section.action";
import { Section, SECTION_TYPE } from "@/types/section.interface";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";
import Image from "next/image";
import CreateSectionForm from "../../Sections/SectionsCreate";
import UpdateSectionForm from "../../Sections/UpdateSectionForm";

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
    if (statusFilter !== "all") {
      const isVisible = statusFilter === "visible";
      result = result.filter((section) => section.isVisible === isVisible);
    }

    // Type filter
    if (typeFilter !== "all") {
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
      [SECTION_TYPE.HERO]: { label: "Hero", variant: "default" as const },
      [SECTION_TYPE.PROMOTIONAL]: {
        label: "Promo",
        variant: "secondary" as const,
      },
      [SECTION_TYPE.BENEFITS]: {
        label: "Benefits",
        variant: "outline" as const,
      },
      [SECTION_TYPE.NEW_ARRIVALS]: {
        label: "New Arrivals",
        variant: "destructive" as const,
      },
    };
    return types[type] || { label: type, variant: "default" as const };
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
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
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Section Management
          </h1>
          <p className="text-muted-foreground">
            Create, edit, and manage your website sections
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchSections}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>

          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Section
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Section</DialogTitle>
                <DialogDescription>
                  Add a new section to your website. Fill in the required
                  fields.
                </DialogDescription>
              </DialogHeader>
              {React.createElement(
                CreateSectionForm as React.ComponentType<any>,
                {
                  onSuccess: handleSectionCreated,
                },
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Sections
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sections.length}</div>
            <p className="text-xs text-muted-foreground">
              All sections in the system
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visible</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                (Array.isArray(sections) ? sections : []).filter(
                  (s) => s?.isVisible,
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Currently visible sections
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hero Sections</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                (Array.isArray(sections) ? sections : []).filter(
                  (s) => s.type === SECTION_TYPE.HERO,
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Main banner sections
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Images</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(Array.isArray(sections) ? sections : []).reduce(
                (acc, s) => acc + (s.images?.length || 0),
                0,
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Total images across all sections
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters Section */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Filter sections by status, type, or search
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search sections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-35">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="visible">
                    <div className="flex items-center gap-2">
                      <Eye className="h-3 w-3" />
                      Visible
                    </div>
                  </SelectItem>
                  <SelectItem value="hidden">
                    <div className="flex items-center gap-2">
                      <EyeOff className="h-3 w-3" />
                      Hidden
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value={SECTION_TYPE.HERO}>Hero</SelectItem>
                  <SelectItem value={SECTION_TYPE.PROMOTIONAL}>
                    Promotional
                  </SelectItem>
                  <SelectItem value={SECTION_TYPE.BENEFITS}>
                    Benefits
                  </SelectItem>
                  <SelectItem value={SECTION_TYPE.NEW_ARRIVALS}>
                    New Arrivals
                  </SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setTypeFilter("all");
                }}
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sections Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sections</CardTitle>
          <CardDescription>
            Manage all your website sections. Click on a section to view
            details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : filteredSections?.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No sections found</h3>
              <p className="text-muted-foreground mb-6">
                {sections.length === 0
                  ? "Get started by creating your first section"
                  : "Try adjusting your filters or search query"}
              </p>
              {sections.length === 0 && (
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Section
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Images</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSections?.map((section) => {
                    const typeBadge = getSectionTypeBadge(section.type);
                    return (
                      <TableRow key={section.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="relative h-10 w-16 rounded-md overflow-hidden border">
                            {section.images?.[0] ? (
                              <Image
                                src={section.images[0]}
                                alt={section.title || "Section"}
                                fill
                                className="object-cover"
                                sizes="64px"
                              />
                            ) : (
                              <div className="h-full w-full bg-muted flex items-center justify-center">
                                <ImageIcon className="h-4 w-4 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {section.title || "Untitled Section"}
                            </span>
                            {section.description && (
                              <span className="text-sm text-muted-foreground truncate max-w-50">
                                {section.description}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={typeBadge.variant}>
                            {typeBadge.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {section.images?.length || 0}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              images
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              section.isVisible ? "default" : "secondary"
                            }
                            className="gap-1"
                          >
                            {section.isVisible ? (
                              <>
                                <Eye className="h-3 w-3" />
                                Visible
                              </>
                            ) : (
                              <>
                                <EyeOff className="h-3 w-3" />
                                Hidden
                              </>
                            )}
                          </Badge>
                        </TableCell>
                        {/* <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-3 w-3" />
                            {formatDate(section.createdAt)}
                          </div>
                        </TableCell> */}
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleViewClick(section)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>View Details</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleEditClick(section)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Edit Section</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={() => handleViewClick(section)}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleEditClick(section)}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleDeleteClick(section.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {filteredSections.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {filteredSections.length} of {sections.length} sections
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Section Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {viewSection && (
            <>
              <DialogHeader>
                <DialogTitle>Section Details</DialogTitle>
                <DialogDescription>
                  View detailed information about this section
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold">
                      {viewSection.title || "Untitled Section"}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        variant={getSectionTypeBadge(viewSection.type).variant}
                      >
                        {getSectionTypeBadge(viewSection.type).label}
                      </Badge>
                      <Badge
                        variant={
                          viewSection.isVisible ? "default" : "secondary"
                        }
                      >
                        {viewSection.isVisible ? "Visible" : "Hidden"}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ID: {viewSection.id.slice(0, 8)}...
                  </div>
                </div>

                {/* Images Grid */}
                <div>
                  <h4 className="font-medium mb-3">
                    Images ({viewSection.images?.length || 0})
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {viewSection.images?.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden border">
                          <Image
                            src={image}
                            alt={`Image ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, 25vw"
                          />
                        </div>
                        {index === 0 && (
                          <Badge className="absolute top-2 left-2">Main</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Description</h4>
                      <p className="text-sm text-muted-foreground">
                        {viewSection.description || "No description provided"}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">CTA Text</h4>
                      <p className="text-sm">
                        {viewSection.ctaText || "Not set"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Link</h4>
                      {viewSection.link ? (
                        <a
                          href={viewSection.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                        >
                          {viewSection.link}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <p className="text-sm text-muted-foreground">Not set</p>
                      )}
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Metadata</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Created:
                          </span>
                          {/* <span>{formatDate(viewSection.createdAt)}</span> */}
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Updated:
                          </span>
                          {/* <span>{formatDate(viewSection.updatedAt)}</span> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Colors */}
                {(viewSection.primaryColor || viewSection.secondaryColor) && (
                  <div>
                    <h4 className="font-medium mb-3">Colors</h4>
                    <div className="flex gap-4">
                      {viewSection.primaryColor && (
                        <div className="flex items-center gap-2">
                          <div
                            className="h-6 w-6 rounded border"
                            style={{
                              backgroundColor: viewSection.primaryColor,
                            }}
                          />
                          <span className="text-sm">
                            {viewSection.primaryColor}
                          </span>
                        </div>
                      )}
                      {viewSection.secondaryColor && (
                        <div className="flex items-center gap-2">
                          <div
                            className="h-6 w-6 rounded border"
                            style={{
                              backgroundColor: viewSection.secondaryColor,
                            }}
                          />
                          <span className="text-sm">
                            {viewSection.secondaryColor}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Section Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Section</DialogTitle>
            <DialogDescription>
              Update the section details and images
            </DialogDescription>
          </DialogHeader>
          {selectedSection &&
            React.createElement(UpdateSectionForm as React.ComponentType<any>, {
              section: selectedSection,
              onSuccess: handleSectionUpdated,
            })}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              section and remove all associated data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSection}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

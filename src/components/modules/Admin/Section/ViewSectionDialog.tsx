"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Eye,
  EyeOff,
  Image as ImageIcon,
  Calendar,
  ExternalLink,
  Copy,
  Download,
  Share2,
} from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { Section, SECTION_TYPE } from "@/types/section.interface";
import { toast } from "sonner";

interface ViewSectionDialogProps {
  section: Section;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewSectionDialog({
  section,
  open,
  onOpenChange,
}: ViewSectionDialogProps) {
  const getSectionTypeLabel = (type: SECTION_TYPE) => {
    const labels = {
      [SECTION_TYPE.HERO]: "Hero Banner",
      [SECTION_TYPE.PROMOTIONAL]: "Promotional",
      [SECTION_TYPE.BENEFITS]: "Benefits",
      [SECTION_TYPE.NEW_ARRIVALS]: "New Arrivals",
    };
    return labels[type] || type;
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(section.id);
    toast.success("Section ID copied to clipboard");
  };

  const handleCopyLink = () => {
    if (section.link) {
      navigator.clipboard.writeText(section.link);
      toast.success("Link copied to clipboard");
    }
  };

  const handleDownloadImage = (imageUrl: string, index: number) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `section-${section.id}-image-${index + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "PPpp");
    } catch {
      return dateString;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Section Details</span>
            <Badge variant={section.isVisible ? "default" : "secondary"}>
              {section.isVisible ? (
                <Eye className="h-3 w-3 mr-1" />
              ) : (
                <EyeOff className="h-3 w-3 mr-1" />
              )}
              {section.isVisible ? "Visible" : "Hidden"}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Complete information about this section
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  Title
                </h4>
                <p className="text-lg font-semibold">
                  {section.title || "Untitled Section"}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  Type
                </h4>
                <Badge variant="outline">
                  {getSectionTypeLabel(section.type)}
                </Badge>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  Section ID
                </h4>
                <div className="flex items-center gap-2">
                  <code className="text-sm bg-muted px-2 py-1 rounded">
                    {section.id}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyId}
                    className="h-8 w-8"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  Description
                </h4>
                <p className="text-sm">
                  {section.description || "No description provided"}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  CTA Text
                </h4>
                <p className="text-sm">{section.ctaText || "Not set"}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Link Section */}
          {section.link && (
            <>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                  Link
                </h4>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <a
                    href={section.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {section.link}
                  </a>
                  <Button variant="ghost" size="sm" onClick={handleCopyLink}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Images Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold">Images</h4>
              <Badge variant="secondary">
                <ImageIcon className="h-3 w-3 mr-1" />
                {section.images?.length || 0} images
              </Badge>
            </div>

            {section.images && section.images.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {section.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden border-2">
                      <Image
                        src={image}
                        alt={`Image ${index + 1}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                      {index === 0 && (
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-black/80">Main</Badge>
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 w-8"
                        onClick={() => handleDownloadImage(image, index)}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border-2 border-dashed rounded-lg">
                <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No images available</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Metadata */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Metadata</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                {/* <div>
                  <h5 className="text-sm font-medium text-muted-foreground mb-1">
                    Created
                  </h5>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    {formatDate(section.createdAt)}
                  </div>
                </div> */}
                {/* <div>
                  <h5 className="text-sm font-medium text-muted-foreground mb-1">
                    Last Updated
                  </h5>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    {formatDate(section.updatedAt)}
                  </div>
                </div> */}
              </div>

              {/* Colors */}
              {(section.primaryColor || section.secondaryColor) && (
                <div className="space-y-3">
                  <h5 className="text-sm font-medium text-muted-foreground">
                    Colors
                  </h5>
                  <div className="flex gap-4">
                    {section.primaryColor && (
                      <div className="flex items-center gap-2">
                        <div
                          className="h-8 w-8 rounded border shadow-sm"
                          style={{ backgroundColor: section.primaryColor }}
                        />
                        <div>
                          <p className="text-sm font-medium">Primary</p>
                          <p className="text-xs text-muted-foreground">
                            {section.primaryColor}
                          </p>
                        </div>
                      </div>
                    )}
                    {section.secondaryColor && (
                      <div className="flex items-center gap-2">
                        <div
                          className="h-8 w-8 rounded border shadow-sm"
                          style={{ backgroundColor: section.secondaryColor }}
                        />
                        <div>
                          <p className="text-sm font-medium">Secondary</p>
                          <p className="text-xs text-muted-foreground">
                            {section.secondaryColor}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

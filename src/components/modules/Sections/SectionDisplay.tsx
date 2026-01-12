// components/section/SectionDisplay.tsx
"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Image as ImageIcon,
  Edit,
  Trash2,
  ExternalLink,
  Eye,
  EyeOff,
} from "lucide-react";
import { SECTION_TYPE } from "@/types/section.interface";

interface SectionDisplayProps {
  section: {
    id: string;
    type: SECTION_TYPE;
    images: string[];
    title?: string;
    description?: string;
    link?: string;
    ctaText?: string;
    isVisible?: boolean;
  };
  onEdit?: () => void;
  onDelete?: () => void;
}

const SectionDisplay: React.FC<SectionDisplayProps> = ({
  section,
  onEdit,
  onDelete,
}) => {
  const getTypeLabel = (type: SECTION_TYPE) => {
    switch (type) {
      case SECTION_TYPE.HERO:
        return { label: "Hero", color: "bg-blue-500" };
      case SECTION_TYPE.PROMOTIONAL:
        return { label: "Promo", color: "bg-red-500" };
      case SECTION_TYPE.BENEFITS:
        return { label: "Benefits", color: "bg-green-500" };
      case SECTION_TYPE.NEW_ARRIVALS:
        return { label: "New", color: "bg-purple-500" };
      default:
        return { label: "Section", color: "bg-gray-500" };
    }
  };

  const { label, color } = getTypeLabel(section.type);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`h-8 w-8 rounded-md ${color} flex items-center justify-center`}
            >
              <ImageIcon className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">
                  {section.title || `${label} Section`}
                </h3>
                <Badge
                  variant="outline"
                  className={`border-${color.split("-")[1]}-200`}
                >
                  {label}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {section.images.length} image
                {section.images.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant={section.isVisible ? "default" : "secondary"}
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
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        {/* Image Grid Preview */}
        <div className="space-y-3">
          {section.images.slice(0, 3).map((image, index) => (
            <div
              key={index}
              className="relative rounded-lg overflow-hidden border"
            >
              <div className="aspect-21/9 bg-muted">
                <img
                  src={image}
                  alt={`Section image ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" fill="%23999"><rect width="400" height="200"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="12">Image {index + 1}</text></svg>';
                  }}
                />
              </div>
              {index === 0 && (
                <div className="absolute top-2 left-2">
                  <Badge className="bg-black/70 hover:bg-black/80">
                    Main Image
                  </Badge>
                </div>
              )}
            </div>
          ))}

          {section.images.length > 3 && (
            <div className="text-center py-2">
              <span className="text-sm text-muted-foreground">
                + {section.images.length - 3} more image
                {section.images.length - 3 !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        {/* Optional Content Preview */}
        {(section.description || section.link || section.ctaText) && (
          <>
            <Separator className="my-3" />
            <div className="space-y-2">
              {section.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {section.description}
                </p>
              )}
              {(section.link || section.ctaText) && (
                <div className="flex items-center gap-3">
                  {section.link && (
                    <a
                      href={section.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Link
                    </a>
                  )}
                  {section.ctaText && (
                    <Badge variant="outline">{section.ctaText}</Badge>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 border-t">
        <div className="flex items-center justify-between w-full">
          <div className="text-xs text-muted-foreground">
            ID: {section.id.slice(0, 8)}...
          </div>
          <div className="flex gap-2">
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onEdit}
                className="h-8 gap-1"
              >
                <Edit className="h-3 w-3" />
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="h-8 gap-1 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
                Delete
              </Button>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SectionDisplay;

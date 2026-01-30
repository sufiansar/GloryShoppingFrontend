// components/section/SectionQuickActions.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  MoreVertical,
  Eye,
  EyeOff,
  Copy,
  Download,
  Archive,
  Link as LinkIcon,
  QrCode,
  Share2,
} from "lucide-react";
import { Section } from "@/types/section.interface";
import { toast } from "sonner";

interface SectionQuickActionsProps {
  section: Section;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleVisibility?: () => void;
}

export function SectionQuickActions({
  section,
  onView,
  onEdit,
  onDelete,
  onToggleVisibility,
}: SectionQuickActionsProps) {
  const handleCopyLink = () => {
    if (section.link) {
      navigator.clipboard.writeText(section.link);
      toast.success("Link copied to clipboard");
    } else {
      toast.error("No link available");
    }
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(section.id);
    toast.success("Section ID copied to clipboard");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: section.title || "Section",
        text: section.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  return (
    <div className="flex items-center gap-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onView}
              className="h-8 w-8"
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
              onClick={onEdit}
              className="h-8 w-8"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>More Actions</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={onView}>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onEdit}>
              <MoreVertical className="h-4 w-4 mr-2" />
              Edit Section
            </DropdownMenuItem>
            {onToggleVisibility && (
              <DropdownMenuItem onClick={onToggleVisibility}>
                {section.isVisible ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Hide Section
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Show Section
                  </>
                )}
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuLabel>Utilities</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={handleCopyId}>
              <Copy className="h-4 w-4 mr-2" />
              Copy ID
            </DropdownMenuItem>
            {section.link && (
              <DropdownMenuItem onClick={handleCopyLink}>
                <LinkIcon className="h-4 w-4 mr-2" />
                Copy Link
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </DropdownMenuItem>
            <DropdownMenuItem>
              <QrCode className="h-4 w-4 mr-2" />
              Generate QR
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuLabel>Danger Zone</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={onDelete}
            className="text-destructive focus:text-destructive"
          >
            <Archive className="h-4 w-4 mr-2" />
            Delete Section
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

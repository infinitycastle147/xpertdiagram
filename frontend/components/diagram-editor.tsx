"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  X,
  Eye,
  Code,
  Palette,
  Loader2,
} from "lucide-react";
import { MermaidViewer } from "./mermaid-viewer";
import { CodeEditor } from "./code-editor";
import { DiagramChat } from "./diagram-chat";

import { useMermaidTheme } from "@/hooks/use-mermaid-theme";
import { createDiagramsApi } from "@/lib/supabase-utils";
import { useSupabase } from "@/app/supabase-provider";
import type { Diagram } from "@/lib/database-types";

interface DiagramEditorProps {
  diagramId: string;
  onClose: () => void;
}

export function DiagramEditor({ diagramId, onClose }: DiagramEditorProps) {
  const { supabase } = useSupabase();
  const [diagram, setDiagram] = useState<Diagram | null>(null);
  const [activeView, setActiveView] = useState("preview");
  const [showChat, setShowChat] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Theme configuration
  const { themeConfig, updateTheme, resetTheme } = useMermaidTheme();

  // Only load diagram when diagramId changes or supabase becomes available
  useEffect(() => {
    if (supabase && diagramId) {
      loadDiagram();
    }
  }, [diagramId, supabase]); // Keep dependencies minimal

  // Memoize loadDiagram to prevent unnecessary re-creations
  const loadDiagram = useCallback(async () => {
    if (!supabase || !diagramId) return;

    try {
      setIsLoading(true);
      const diagramsApi = createDiagramsApi(supabase);
      const diagramData = await diagramsApi.getById(diagramId);
      
      if (!diagramData) {
        setDiagram(null);
        return;
      }

      setDiagram(diagramData);
    } catch (error) {
      console.error("Error loading diagram:", error);
      setDiagram(null);
    } finally {
      setIsLoading(false);
    }
  }, [supabase, diagramId]);

  const handleSave = async () => {
    if (!supabase || !diagram) return;

    try {
      setIsSaving(true);
      const diagramsApi = createDiagramsApi(supabase);
      const updatedDiagram = await diagramsApi.update(diagram.id, {
        name: diagram.name,
        content: diagram.content,
        type: diagram.type,
      });
      setDiagram(updatedDiagram);
    } catch (error) {
      console.error("Error saving diagram:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 rounded-xl bg-muted/30 flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground mb-2">Loading diagram...</p>
          <p className="text-xs text-muted-foreground/70">This should only take a moment</p>
        </div>
      </div>
    );
  }

  if (!diagram) {
    return (
      <div className="h-full flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 rounded-xl bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-destructive" />
          </div>
          <p className="text-sm font-medium text-foreground mb-1">Diagram not found</p>
          <p className="text-xs text-muted-foreground mb-4">The diagram may have been deleted or moved</p>
          <Button variant="outline" onClick={onClose} className="rounded-xl">
            <X className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="h-full flex flex-col bg-background animate-fade-in">
        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {activeView === "preview" ? (
            <MermaidViewer
              content={diagram.content}
              themeConfig={themeConfig}
              onThemeChange={updateTheme}
              showChat={showChat}
              onToggleChat={() => setShowChat(!showChat)}
              activeView={activeView}
              onViewChange={setActiveView}
              onSave={handleSave}
              isSaving={isSaving}
            />
          ) : (
            <CodeEditor
              content={diagram.content}
              onChange={(content) =>
                setDiagram((prev) => (prev ? { ...prev, content } : null))
              }
              onSave={handleSave}
              isSaving={isSaving}
              activeView={activeView}
              onViewChange={setActiveView}
            />
          )}
        </div>

        {/* Chat Sidebar */}
        {showChat && (
          <div className="w-80 lg:w-96 flex-shrink-0 border-l border-border bg-card overflow-hidden animate-slide-in-left">
            <DiagramChat
              diagramId={diagramId}
              onClose={() => setShowChat(false)}
              onUpdateDiagram={(content) =>
                setDiagram((prev) => (prev ? { ...prev, content } : null))
              }
            />
          </div>
        )}
        </div>
      </div>
    </TooltipProvider>
  );
}

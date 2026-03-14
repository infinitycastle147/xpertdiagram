"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner, LoadingDots } from "@/components/ui/loading";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sparkles,
  FileText,
  Workflow,
  GitBranch,
  Database,
  Network,
  Brain,
  Wand2,
  LayoutGrid,
  Users,
  Calendar,
  PieChart,
  Grid3x3,
  CheckSquare,
  GitCommit,
  Box,
  Clock,
  Columns,
  Binary,
  BarChart3,
  Blocks,
  PackageCheck,
  KanbanSquare,
  Activity,
} from "lucide-react";
import { createDiagramsApi } from "@/lib/supabase-utils";
import { useSupabase } from "@/app/supabase-provider";
import { useSession } from "@clerk/nextjs";
import { detectDiagramType, generateDiagram } from "@/lib/ai-service";
import { DiagramType, DiagramTypeLabels } from "@/lib/diagram-types";

interface DiagramGeneratorProps {
  onClose: () => void;
  onDiagramCreated: (diagramId: string) => void;
}

const diagramTypeIcons: Record<DiagramType, any> = {
  [DiagramType.FLOWCHART]: Workflow,
  [DiagramType.SEQUENCE]: GitBranch,
  [DiagramType.CLASS]: LayoutGrid,
  [DiagramType.STATE]: Activity,
  [DiagramType.ERD]: Database,
  [DiagramType.USER_JOURNEY]: Users,
  [DiagramType.GANTT]: Calendar,
  [DiagramType.PIE]: PieChart,
  [DiagramType.QUADRANT_CHART]: Grid3x3,
  [DiagramType.REQUIREMENT]: CheckSquare,
  [DiagramType.GITGRAPH]: GitCommit,
  [DiagramType.C4]: Box,
  [DiagramType.MINDMAP]: Brain,
  [DiagramType.TIMELINE]: Clock,
  [DiagramType.ZENUML]: Columns,
  [DiagramType.SANKEY]: Binary,
  [DiagramType.XY_CHART]: BarChart3,
  [DiagramType.BLOCK]: Blocks,
  [DiagramType.PACKET]: PackageCheck,
  [DiagramType.KANBAN]: KanbanSquare,
  [DiagramType.ARCHITECTURE]: Network,
  [DiagramType.RADAR]: Activity,
};

const diagramTypes = Object.values(DiagramType).map((type) => ({
  id: type,
  name: DiagramTypeLabels[type],
  icon: diagramTypeIcons[type],
}));

export function DiagramGenerator({
  onClose,
  onDiagramCreated,
}: DiagramGeneratorProps) {
  const { supabase } = useSupabase();
  const { session } = useSession();
  const [content, setContent] = useState("");
  const [query, setQuery] = useState("");
  const [selectedType, setSelectedType] = useState<DiagramType>(
    DiagramType.FLOWCHART
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [diagramName, setDiagramName] = useState("");
  const [generationProgress, setGenerationProgress] = useState(0);

  const handleDetectType = async () => {
    if (!content.trim()) return;

    setIsDetecting(true);
    try {
      const authToken = await session?.getToken();
      const response = await detectDiagramType(
        {
          content: content,
          query: query || content,
        },
        authToken || undefined
      );

      if (
        response.diagram_type &&
        diagramTypes.find((t) => t.id === response.diagram_type)
      ) {
        setSelectedType(response.diagram_type);
      }
    } catch (error) {
      console.error("Error detecting diagram type:", error);
    } finally {
      setIsDetecting(false);
    }
  };

  const handleGenerate = async () => {
    if (!supabase || !content.trim()) return;

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // Simulate progress steps
      setGenerationProgress(20);
      
      // Generate diagram using AI service
      const authToken = await session?.getToken();
      setGenerationProgress(40);
      
      const response = await generateDiagram(
        {
          type: selectedType,
          query: query || content,
          content: content,
        },
        authToken || undefined
      );

      setGenerationProgress(70);

      // Generate diagram name from content
      const generatedName =
        diagramName.trim() ||
        content.split("\n")[0].substring(0, 50) ||
        "New Diagram";

      // Save to database
      const diagramsApi = createDiagramsApi(supabase);
      setGenerationProgress(90);
      
      const newDiagram = await diagramsApi.create({
        name: generatedName,
        type: selectedType,
        content: response.diagram,
      });

      setGenerationProgress(100);
      onDiagramCreated(newDiagram.id);
    } catch (error) {
      console.error("Error generating diagram:", error);
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  return (
    <TooltipProvider>
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="w-[90vw] max-w-4xl h-[90vh] max-h-[900px] overflow-hidden flex flex-col p-0 gap-0">
          <DialogHeader className="flex-shrink-0 px-8 pt-8 pb-6 border-b">
            <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
              Generate New Diagram
              <Badge variant="secondary" className="text-xs">AI Powered</Badge>
            </DialogTitle>
          </DialogHeader>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          {!isGenerating ? (
            <div className="flex flex-col gap-6 max-w-3xl mx-auto pb-4">
              <div className="space-y-5">
                {/* Diagram Name Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    Diagram Name
                    <span className="text-xs text-muted-foreground ml-auto">
                      (Optional)
                    </span>
                  </label>
                  <Input
                    placeholder="e.g., 'User Login Flow', 'System Architecture'"
                    value={diagramName}
                    onChange={(e) => setDiagramName(e.target.value)}
                    className="h-10"
                  />
                </div>

                {/* Content Field - Primary Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    What would you like to diagram?
                    <span className="text-destructive ml-1">*</span>
                  </label>
                  <Textarea
                    placeholder="Describe your process, system, or concept. For example:&#10;• User registration flow for a web app&#10;• Database schema for an e-commerce system&#10;• Company organizational structure&#10;• Software deployment process"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-32 resize-none focus:ring-2 focus:ring-primary/20 transition-all"
                    maxLength={2000}
                  />
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>Be as detailed as possible for better results</span>
                    <span>{content.length}/2000</span>
                  </div>
                </div>

                {/* Additional Instructions Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Wand2 className="w-4 h-4 text-muted-foreground" />
                    Additional Instructions
                    <span className="text-xs text-muted-foreground ml-auto">
                      (Optional)
                    </span>
                  </label>
                  <Input
                    placeholder="e.g., 'Include error handling', 'Show database relationships', 'Focus on user experience'"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="h-10"
                  />
                </div>

                {/* Diagram Type Selector */}
                {/* Header Section */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-foreground">
                      Diagram Type
                    </label>

                    {/* Select Dropdown */}
                    <Select
                      value={selectedType}
                      onValueChange={(value) =>
                        setSelectedType(value as DiagramType)
                      }
                    >
                      <SelectTrigger className="h-10 border-muted bg-background/40 hover:bg-accent/10">
                        <SelectValue placeholder="Select diagram type" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[320px]">
                        {diagramTypes.map((type: any) => {
                          const Icon = type.icon;
                          return (
                            <SelectItem
                              key={type.id}
                              value={type.id}
                              className="cursor-pointer py-1.5"
                            >
                              <div className="flex items-center gap-2">
                                <Icon className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">{type.name}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={handleDetectType}
                        disabled={!content.trim() || isDetecting}
                        variant="secondary"
                        size="sm"
                        className="h-8 px-3 text-xs gap-1.5 border border-border bg-background hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all"
                      >
                        {isDetecting ? (
                          <>
                            <LoadingSpinner size="sm" />
                            <span>Detecting...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>AI Detect</span>
                          </>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Let AI suggest the best diagram type for your content</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <LoadingSpinner size="lg" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-center">
                Generating Your Diagram
              </h3>
              <p className="text-muted-foreground mb-6 text-center text-sm max-w-md">
                Our AI is analyzing your content and creating the perfect
                diagram. This usually takes just a few seconds.
              </p>
              
              {/* Progress Bar */}
              <div className="w-full mb-6">
                <Progress value={generationProgress} className="w-full" />
                <p className="text-xs text-muted-foreground text-center mt-2">
                  {generationProgress}% complete
                </p>
              </div>
              
              <div className="flex flex-col gap-3 text-sm text-muted-foreground w-full bg-muted/30 rounded-lg p-5 border">
                <LoadingDots text="Analyzing content structure" size="sm" />
                <LoadingDots text="Selecting optimal diagram type" size="sm" />
                <LoadingDots text="Generating Mermaid code" size="sm" />
              </div>
            </div>
          )}
        </div>

        <div className="flex-shrink-0 px-8 py-5 border-t bg-muted/30">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            <Button
              variant="outline"
              onClick={onClose}
              className="h-10 px-5 bg-transparent"
            >
              Cancel
            </Button>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleGenerate}
                  disabled={!content.trim() || isGenerating}
                  className="h-10 px-6 gap-2 bg-primary hover:bg-primary/90 text-white"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Diagram</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create your AI-powered diagram</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </TooltipProvider>
  );
}

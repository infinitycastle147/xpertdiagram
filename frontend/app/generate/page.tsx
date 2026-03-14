"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner, LoadingDots } from "@/components/ui/loading";
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
  ArrowLeft,
} from "lucide-react";
import { createDiagramsApi } from "@/lib/supabase-utils";
import { useSupabase } from "@/app/supabase-provider";
import { useSession } from "@clerk/nextjs";
import { detectDiagramType, generateDiagram } from "@/lib/ai-service";
import { DiagramType, DiagramTypeLabels } from "@/lib/diagram-types";

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

export default function GeneratePage() {
  const router = useRouter();
  
  const { supabase } = useSupabase();
  const { session } = useSession();
  
  const [content, setContent] = useState("");
  const [query, setQuery] = useState("");
  const [selectedType, setSelectedType] = useState<DiagramType>(DiagramType.FLOWCHART);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [diagramName, setDiagramName] = useState("");

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

    try {
      // Generate diagram using AI service
      const authToken = await session?.getToken();
      const response = await generateDiagram(
        {
          type: selectedType,
          query: query || content,
          content: content,
        },
        authToken || undefined
      );

      // Generate diagram name from content
      const generatedName =
        diagramName.trim() ||
        content.split("\n")[0].substring(0, 50) ||
        "New Diagram";

      // Save to database
      const diagramsApi = createDiagramsApi(supabase);
      const newDiagram = await diagramsApi.create({
        name: generatedName,
        type: selectedType,
        content: response.diagram,
      });

      // Navigate to the new diagram
      router.push(`/?diagram=${newDiagram.id}`);
    } catch (error) {
      console.error("Error generating diagram:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBack = () => {
    router.push("/");
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0 border-b bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="gap-2 text-muted-foreground hover:text-foreground rounded-xl flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Studio</span>
              <span className="sm:hidden">Back</span>
            </Button>
            <div className="h-6 w-px bg-border hidden sm:block" />
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-semibold text-foreground truncate">
                Generate New Diagram
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                Describe your idea and let AI create the perfect diagram
              </p>
            </div>
          </div>

        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
          {!isGenerating ? (
            <div className="container-max section-padding">
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Main Form - Takes up 2 columns on large screens */}
                  <div className="lg:col-span-2 space-y-8">
                    <div className="space-y-6">
                      {/* Diagram Name Field */}
                      <div className="space-y-3">
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
                          className="h-12 text-base"
                        />
                      </div>

                      {/* Content Field - Primary Input */}
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-foreground flex items-center gap-2">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          What would you like to diagram?
                          <span className="text-destructive ml-1">*</span>
                        </label>
                        <Textarea
                          placeholder="Describe your process, system, or concept. For example:&#10;• User registration flow for a web app&#10;• Database schema for an e-commerce system&#10;• Company organizational structure&#10;• Software deployment process"
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          className="min-h-40 max-h-96 text-base resize-y focus:ring-2 focus:ring-primary/20 transition-all"
                          maxLength={2000}
                        />
                        <div className="flex justify-between items-center text-xs text-muted-foreground mt-1">
                          <span>Be as detailed as possible for better results</span>
                          <span className={content.length > 1800 ? "text-destructive" : ""}>{content.length}/2000</span>
                        </div>
                      </div>

                      {/* Additional Instructions Field */}
                      <div className="space-y-3">
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
                          className="h-12 text-base"
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-6 border-t">
                      <Button
                        variant="outline"
                        onClick={handleBack}
                        className="h-12 px-6 order-2 sm:order-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleGenerate}
                        disabled={!content.trim() || isGenerating}
                        className="h-12 px-8 gap-2 bg-primary hover:bg-primary/90 text-white w-full sm:w-auto order-1 sm:order-2"
                        size="lg"
                      >
                        <Sparkles className="w-5 h-5" />
                        <span>Generate Diagram</span>
                      </Button>
                    </div>
                  </div>

                  {/* Sidebar - Diagram Type Selection */}
                  <div className="lg:col-span-1">
                    <div className="sticky top-8 space-y-6">
                      {/* Diagram Type Selector */}
                      <div className="bg-card rounded-xl p-6 border">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-foreground">
                              Diagram Type
                            </label>
                            <Button
                              onClick={handleDetectType}
                              disabled={!content.trim() || isDetecting}
                              variant="secondary"
                              size="sm"
                              className="h-8 px-3 text-xs gap-1.5"
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
                          </div>

                          <Select
                            value={selectedType}
                            onValueChange={(value) => setSelectedType(value as DiagramType)}
                          >
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Select diagram type" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[320px]">
                              {diagramTypes.map((type: any) => {
                                const Icon = type.icon;
                                return (
                                  <SelectItem
                                    key={type.id}
                                    value={type.id}
                                    className="cursor-pointer py-3"
                                  >
                                    <div className="flex items-center gap-3">
                                      <Icon className="w-4 h-4 text-muted-foreground" />
                                      <span className="text-sm">{type.name}</span>
                                    </div>
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>

                          {/* Selected Type Preview */}
                          {selectedType && (
                            <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                              <div className="flex items-center gap-3">
                                {(() => {
                                  const Icon = diagramTypeIcons[selectedType];
                                  return <Icon className="w-5 h-5 text-primary" />;
                                })()}
                                <div>
                                  <p className="text-sm font-medium">
                                    {DiagramTypeLabels[selectedType]}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Selected diagram type
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Tips Card */}
                      <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl p-6 border border-primary/20">
                        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-primary" />
                          Pro Tips
                        </h3>
                        <ul className="space-y-2 text-xs text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
                            Be specific about your process or system
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
                            Include key steps, components, or relationships
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
                            Use AI Detect to find the best diagram type
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
                            Add context in additional instructions
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="container-max section-padding">
              <div className="flex flex-col items-center justify-center py-16 max-w-lg mx-auto">
                <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center mb-8">
                  <LoadingSpinner size="lg" />
                </div>
                <h2 className="text-2xl font-semibold mb-3 text-center">
                  Generating Your Diagram
                </h2>
                <p className="text-muted-foreground mb-12 text-center max-w-md leading-relaxed">
                  Our AI is analyzing your content and creating the perfect diagram. 
                  This usually takes just a few seconds.
                </p>
                <div className="flex flex-col gap-4 text-sm text-muted-foreground w-full bg-muted/30 rounded-xl p-6 border">
                  <LoadingDots text="Analyzing content structure" size="sm" />
                  <LoadingDots text="Selecting optimal diagram type" size="sm" />
                  <LoadingDots text="Generating Mermaid code" size="sm" />
                  <LoadingDots text="Finalizing diagram" size="sm" />
                </div>
              </div>
            </div>
          )}
        </main>
    </div>
  );
}
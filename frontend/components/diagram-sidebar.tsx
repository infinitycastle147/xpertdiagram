"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Plus,
  Search,
  MoreHorizontal,
  Calendar,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createDiagramsApi } from "@/lib/supabase-utils";
import { useSupabase } from "@/app/supabase-provider";
import type { Diagram } from "@/lib/database-types";

interface DiagramSidebarProps {
  activeDiagram: string | null;
  setActiveDiagram: (id: string | null) => void;
  onNewDiagram: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function DiagramSidebar({
  activeDiagram,
  setActiveDiagram,
  onNewDiagram,
  isCollapsed = false,
  onToggleCollapse,
}: DiagramSidebarProps) {
  const { supabase } = useSupabase();
  const [searchQuery, setSearchQuery] = useState("");
  const [diagrams, setDiagrams] = useState<Diagram[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [editingDiagramId, setEditingDiagramId] = useState<string | null>(null);
  const [editingDiagramName, setEditingDiagramName] = useState("");

  // Load diagrams
  const loadDiagrams = useCallback(async () => {
    if (!supabase || hasLoaded) return;

    try {
      setIsLoading(true);
      const diagramsApi = createDiagramsApi(supabase);
      const data = await diagramsApi.getAll();
      setDiagrams(data);
      setHasLoaded(true);
    } catch (error) {
      console.error("Error loading diagrams:", error);
    } finally {
      setIsLoading(false);
    }
  }, [supabase, hasLoaded]);

  // Load diagrams when supabase client becomes available
  useEffect(() => {
    loadDiagrams();
  }, [loadDiagrams]);

  // Filter diagrams based on search query
  const filteredDiagrams = useMemo(() => {
    if (!searchQuery.trim()) return diagrams;

    const query = searchQuery.toLowerCase();
    return diagrams.filter(
      (diagram) =>
        diagram.name.toLowerCase().includes(query) ||
        diagram.type.toLowerCase().includes(query)
    );
  }, [diagrams, searchQuery]);

  const handleDeleteDiagram = async (diagramId: string) => {
    if (!supabase || !confirm("Are you sure you want to delete this diagram?"))
      return;

    try {
      const diagramsApi = createDiagramsApi(supabase);
      await diagramsApi.delete(diagramId);
      setDiagrams(diagrams.filter((diagram) => diagram.id !== diagramId));
      if (activeDiagram === diagramId) {
        setActiveDiagram(null);
      }
    } catch (error) {
      console.error("Error deleting diagram:", error);
    }
  };

  const handleEditDiagram = (diagram: Diagram) => {
    setEditingDiagramId(diagram.id);
    setEditingDiagramName(diagram.name);
  };

  const handleSaveEditDiagram = async () => {
    if (!supabase || !editingDiagramName.trim() || !editingDiagramId) return;

    try {
      const diagramsApi = createDiagramsApi(supabase);
      const updatedDiagram = await diagramsApi.update(editingDiagramId, {
        name: editingDiagramName.trim(),
      });

      setDiagrams(
        diagrams.map((diagram) =>
          diagram.id === editingDiagramId
            ? { ...diagram, ...updatedDiagram }
            : diagram
        )
      );
      setEditingDiagramId(null);
      setEditingDiagramName("");
    } catch (error) {
      console.error("Error updating diagram:", error);
    }
  };

  const handleCancelEditDiagram = () => {
    setEditingDiagramId(null);
    setEditingDiagramName("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveEditDiagram();
    } else if (e.key === "Escape") {
      handleCancelEditDiagram();
    }
  };

  const CollapseIcon = isCollapsed ? ChevronRight : ChevronLeft;

  return (
    <TooltipProvider>
      <div className="h-full w-full bg-card border-r border-border flex flex-col animate-slide-in-left">
        {/* Header */}
        <div className="flex-shrink-0 p-4 pb-2 border-b border-border/50">
          <div
            className={`flex items-center ${
              isCollapsed ? "justify-center" : "justify-between"
            } gap-2`}
          >
            {!isCollapsed && (
              <h3 className="font-semibold text-foreground">My Diagrams</h3>
            )}
            <div className="flex items-center gap-2">
              {!isCollapsed && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover-scale rounded-xl dark:hover:text-primary dark:hover:bg-primary/20"
                      onClick={onNewDiagram}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Create new diagram</p>
                  </TooltipContent>
                </Tooltip>
              )}

              {onToggleCollapse && (
                <Tooltip>
                  <TooltipTrigger asChild >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-xl hover-scale text-muted-foreground hover:text-primary dark:hover:text-primary hover:bg-primary/20 dark:hover:bg-primary/20 focus-visible:ring-1 focus-visible:ring-primary/40"
                      onClick={onToggleCollapse}
                    >
                      <CollapseIcon className="w-4 h-4"/>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isCollapsed ? "Expand sidebar" : "Collapse sidebar"}</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        </div>

        {!isCollapsed && (
          <>
            {/* Search */}
            <div className="flex-shrink-0 p-4 border-b border-border/50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search diagrams..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-sky-400/15 dark:bg-sky-300/20 focus-ring rounded-xl border-border/50 hover:border-border placeholder:text-foreground/60 dark:placeholder:text-muted-foreground transition-colors"
                />
              </div>
            </div>

            {/* Diagrams List - Scrollable */}
            <div className="flex-1 min-h-0">
              <ScrollArea className="h-full">
                <div className="px-4 pb-6">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center mb-3">
                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        Loading diagrams...
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredDiagrams.map((diagram) => (
                        <Card
                          key={diagram.id}
                          className={`group overflow-hidden rounded-xl animate-fade-in cursor-pointer transition-all duration-150 min-h-[60px] ${
                            activeDiagram === diagram.id
                              ? "bg-primary/10 border-primary/20 text-primary"
                              : "hover:bg-muted/70"
                          }`}
                          onClick={() =>
                            editingDiagramId !== diagram.id &&
                            setActiveDiagram(diagram.id)
                          }
                        >
                          <CardHeader className="px-4 py-2">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="flex-1 min-w-0">
                                  {editingDiagramId === diagram.id ? (
                                    <Input
                                      value={editingDiagramName}
                                      onChange={(e) =>
                                        setEditingDiagramName(
                                          e.target.value
                                        )
                                      }
                                      onKeyDown={handleKeyPress}
                                      className="text-sm font-medium bg-transparent border-0 p-0 h-auto focus-visible:ring-0"
                                      autoFocus
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                  ) : (
                                    <div className="flex items-center justify-between gap-3">
                                      <CardTitle className="text-sm font-medium leading-tight">
                                        {diagram.name}
                                      </CardTitle>
                                      <Badge
                                        variant="secondary"
                                        className="text-xs capitalize px-2 py-0.5 whitespace-nowrap"
                                      >
                                        {diagram.type}
                                      </Badge>
                                    </div>
                                  )}

                                  {/* Diagram Info - Always visible */}
                                  {editingDiagramId !== diagram.id && (
                                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                                      <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(
                                          diagram.updated_at
                                        ).toLocaleDateString()}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 rounded-lg hover-scale opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 dark:hover:text-primary dark:hover:bg-primary/20"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <MoreHorizontal className="w-3 h-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" >
                                  <DropdownMenuItem
                                    className="dark:hover:text-white dark:hover:bg-primary/20"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditDiagram(diagram);
                                    }}
                                  >
                                    Edit Name
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="dark:text-destructive dark:hover:text-destructive dark:hover:bg-destructive/20"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteDiagram(diagram.id);
                                    }}
                                  >
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>

                            {/* Edit Controls */}
                            {editingDiagramId === diagram.id && (
                              <div className="flex items-center gap-2 mt-3">
                                <Button
                                  size="sm"
                                  className="h-7 text-xs px-3"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSaveEditDiagram();
                                  }}
                                  disabled={!editingDiagramName.trim()}
                                >
                                  Save
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 text-xs px-3"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCancelEditDiagram();
                                  }}
                                >
                                  Cancel
                                </Button>
                              </div>
                            )}
                          </CardHeader>
                        </Card>
                      ))}

                      {!isLoading && filteredDiagrams.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                          <div className="w-16 h-16 rounded-xl bg-muted/30 flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-8 h-8 text-muted-foreground/60" />
                          </div>
                          {searchQuery ? (
                            <>
                              <p className="text-sm font-medium mb-1">
                                No matches found
                              </p>
                              <p className="text-xs">
                                Try a different search term
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="text-sm font-medium mb-1">
                                No diagrams yet
                              </p>
                              <p className="text-xs mb-4">
                                Create your first diagram to get started
                              </p>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={onNewDiagram}
                                    className="gap-2"
                                  >
                                    <Plus className="w-4 h-4" />
                                    Create Diagram
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Create your first diagram</p>
                                </TooltipContent>
                              </Tooltip>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </>
        )}
      </div>
    </TooltipProvider>
  );
}

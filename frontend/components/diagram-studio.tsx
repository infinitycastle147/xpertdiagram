"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { FileText, Folder, Menu, X, Network, ChevronRight } from "lucide-react"
import { Logo } from "./logo"
import { DiagramSidebar } from "./diagram-sidebar"
import { DiagramEditor } from "./diagram-editor"
import { useMobileSidebar } from "@/lib/hooks/use-mobile-sidebar"

function WelcomeScreen() {
    return (
        <div className="flex flex-col items-center justify-center min-h-full py-8 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-6xl mx-auto space-y-8 lg:space-y-12">
                <div className="flex flex-col items-center space-y-4 lg:space-y-6 text-center">
                    <Logo size="lg" />
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight tracking-tight">
                        Create Expert Diagrams
                    </h2>
                    <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                        Transform your ideas into beautiful, professional diagrams with AI. Simple, fast, and expert.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                    <Card className="relative overflow-hidden bg-gradient-to-br from-teal-500 to-teal-600 border-0 text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group">
                        <CardContent className="p-6 lg:p-8 space-y-3 lg:space-y-4">
                            <div className="w-12 lg:w-14 h-12 lg:h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                                <Network className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                            </div>
                            <div className="space-y-1 lg:space-y-2">
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                                        AI Powered
                                    </Badge>
                                </div>
                                <h4 className="text-lg lg:text-xl font-bold text-white">Smart Generation</h4>
                                <p className="text-xs lg:text-sm text-white/90 leading-relaxed">
                                    Describe your diagram in natural language and let AI create it for you
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden bg-gradient-to-br from-orange-500 to-orange-600 border-0 text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group">
                        <CardContent className="p-6 lg:p-8 space-y-3 lg:space-y-4">
                            <div className="w-12 lg:w-14 h-12 lg:h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                                <FileText className="w-6 lg:w-7 h-6 lg:h-7 text-white" />
                            </div>
                            <div className="space-y-1 lg:space-y-2">
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                                        Multiple Formats
                                    </Badge>
                                </div>
                                <h4 className="text-lg lg:text-xl font-bold text-white">Flexible Output</h4>
                                <p className="text-xs lg:text-sm text-white/90 leading-relaxed">
                                    Generate Mermaid diagrams and convert to Excalidraw for sketchy style
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 border-0 text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group md:col-span-3 lg:col-span-1">
                        <CardContent className="p-6 lg:p-8 space-y-3 lg:space-y-4">
                            <div className="w-12 lg:w-14 h-12 lg:h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                                <FileText className="w-6 lg:w-7 h-6 lg:h-7 text-white" />
                            </div>
                            <div className="space-y-1 lg:space-y-2">
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                                        Personal Workspace
                                    </Badge>
                                </div>
                                <h4 className="text-lg lg:text-xl font-bold text-white">Your Diagrams</h4>
                                <p className="text-xs lg:text-sm text-white/90 leading-relaxed">
                                    All your diagrams in one place, organized and easily accessible
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export function DiagramStudio() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [activeDiagram, setActiveDiagram] = useState<string | null>(null)
    const { isMobile, sidebarOpen, toggleSidebar, closeSidebar } = useMobileSidebar()
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

    // Handle URL parameters for diagram selection
    useEffect(() => {
        const diagramId = searchParams.get('diagram')
        if (diagramId) {
            setActiveDiagram(diagramId)
        }
    }, [searchParams])

    // Memoize handlers to prevent unnecessary re-renders
    const handleNewDiagram = useCallback(() => {
        router.push('/generate')
        closeSidebar()
    }, [router, closeSidebar])

    const handleDiagramSelect = useCallback((diagramId: string | null) => {
        setActiveDiagram(diagramId)
        closeSidebar()
    }, [closeSidebar])

    return (
        <TooltipProvider>
            <div className="h-full w-full bg-background page-enter">
                {/* Mobile Header */}
                {isMobile && (
                    <div className="flex items-center justify-between p-4 border-b bg-card/95 backdrop-blur-sm lg:hidden">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={toggleSidebar}
                                    className="gap-2"
                                >
                                    <Menu className="w-4 h-4" />
                                    Diagrams
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Open diagrams sidebar</p>
                            </TooltipContent>
                        </Tooltip>
                        {activeDiagram && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setActiveDiagram(null)}
                                        className="gap-2"
                                    >
                                        <X className="w-4 h-4" />
                                        Close
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Close diagram editor</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </div>
                )}

            <div className="main-grid relative">
                {/* Sidebar */}
                <div className={`${isMobile ? (sidebarOpen ? 'sidebar open' : 'sidebar') : `sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}`}>
                    <DiagramSidebar
                        activeDiagram={activeDiagram}
                        setActiveDiagram={handleDiagramSelect}
                        onNewDiagram={handleNewDiagram}
                        isCollapsed={!isMobile && sidebarCollapsed}
                        onToggleCollapse={
                            isMobile
                                ? undefined
                                : () => setSidebarCollapsed((prev) => !prev)
                        }
                    />
                </div>

                {/* Sidebar expand control for collapsed desktop */}
                {!isMobile && sidebarCollapsed && (
                    <div className="absolute left-2 top-4 z-40">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="rounded-xl bg-card/90 border border-border/60 text-muted-foreground hover:text-primary hover:bg-primary/20 focus-visible:ring-1 focus-visible:ring-primary/40 shadow-sm"
                                    onClick={() => setSidebarCollapsed(false)}
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Expand sidebar</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                )}

                {/* Overlay for mobile */}
                {isMobile && sidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={closeSidebar}
                    />
                )}

                {/* Main Content */}
                <main className="flex-1 min-w-0 overflow-hidden">
                    {!activeDiagram ? (
                        <div className="h-full overflow-y-auto">
                            <WelcomeScreen />
                        </div>
                    ) : (
                        <DiagramEditor 
                            diagramId={activeDiagram} 
                            onClose={() => setActiveDiagram(null)} 
                        />
                    )}
                </main>
            </div>
        </div>
        </TooltipProvider>
    )
}

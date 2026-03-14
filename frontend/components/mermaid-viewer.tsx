"use client"

import {useEffect, useRef, useState} from "react"
import {Button} from "@/components/ui/button"
import {Alert, AlertDescription} from "@/components/ui/alert"
import {Download, Maximize2, SparklesIcon, ZoomIn, ZoomOut, Eye, Code, ChevronDown, Settings} from "lucide-react"
import {Label} from "@/components/ui/label"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"

import {Switch} from "@/components/ui/switch"
import {Separator} from "@/components/ui/separator"
import {Loading} from "@/components/ui/loading"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import {getMermaidInstance, MermaidThemeConfig} from "@/lib/mermaid-manager"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface MermaidViewerProps {
    content: string
    className?: string
    theme?: "default" | "dark" | "forest" | "neutral"
    themeConfig?: MermaidThemeConfig
    onThemeChange?: (updates: Partial<MermaidThemeConfig>) => void
    // Additional action buttons
    showChat?: boolean
    onToggleChat?: () => void
    // View switching
    activeView?: string
    onViewChange?: (view: string) => void
    // Code editor controls
    onSave?: () => void
    isSaving?: boolean
}

export function MermaidViewer({
    content, 
    theme = "default", 
    themeConfig, 
    onThemeChange,
    showChat,
    onToggleChat,
    activeView,
    onViewChange,
    onSave,
    isSaving
}: MermaidViewerProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [zoom, setZoom] = useState(1)
    const [mermaidInstance, setMermaidInstance] = useState<any>(null)
    const [renderKey, setRenderKey] = useState(0)
    const [showThemeMenu, setShowThemeMenu] = useState(false)

    // Debug dropdown state
    useEffect(() => {
        console.log('Theme dropdown state:', showThemeMenu);
    }, [showThemeMenu]);

    // Apply custom styles for font size and family
    useEffect(() => {
        if (!themeConfig) return;

        const styleId = 'mermaid-custom-styles';
        let styleElement = document.getElementById(styleId) as HTMLStyleElement;
        
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = styleId;
            document.head.appendChild(styleElement);
        }

        styleElement.textContent = `
            .mermaid svg {
                ${themeConfig.fontFamily ? `font-family: ${themeConfig.fontFamily} !important;` : ''}
                ${themeConfig.fontSize ? `font-size: ${themeConfig.fontSize}px !important;` : ''}
            }
            .mermaid svg text {
                ${themeConfig.fontFamily ? `font-family: ${themeConfig.fontFamily} !important;` : ''}
                ${themeConfig.fontSize ? `font-size: ${themeConfig.fontSize}px !important;` : ''}
            }
            .mermaid svg .node text,
            .mermaid svg .edge text,
            .mermaid svg .label text {
                ${themeConfig.fontFamily ? `font-family: ${themeConfig.fontFamily} !important;` : ''}
                ${themeConfig.fontSize ? `font-size: ${themeConfig.fontSize}px !important;` : ''}
            }
        `;

        return () => {
            // Cleanup on unmount
            if (styleElement && styleElement.parentNode) {
                styleElement.parentNode.removeChild(styleElement);
            }
        };
    }, [themeConfig?.fontFamily, themeConfig?.fontSize]);

    // Initialize Mermaid using shared instance with theme config
    useEffect(() => {
        const initMermaid = async () => {
            try {
                // Merge theme prop with themeConfig, with themeConfig taking precedence
                const config: MermaidThemeConfig = {
                    theme: themeConfig?.theme || theme,
                    ...themeConfig
                }
                
                const mermaid = await getMermaidInstance(config)
                if (mermaid) {
                    setMermaidInstance(mermaid)
                    // Force re-render when theme changes
                    setRenderKey(prev => prev + 1)
                } else {
                    throw new Error("Failed to get Mermaid instance")
                }
            } catch (error) {
                console.error("Failed to initialize Mermaid:", error)
                setError("Failed to initialize diagram renderer")
                setIsLoading(false)
            }
        }
        initMermaid()
    }, [theme, themeConfig])

    // This effect is now handled in the mermaid-manager when config changes

    useEffect(() => {
        let isMounted = true
        
        if (!content || !containerRef.current || !mermaidInstance) return

        const renderMermaid = async () => {
            try {
                setIsLoading(true)
                setError(null)

                // Validate content before rendering
                if (!content.trim()) {
                    throw new Error("Empty diagram content")
                }

                const element = containerRef.current
                if (!element || !isMounted) return

                const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

                // Clear previous content
                element.innerHTML = ''

                // Validate diagram syntax before rendering
                try {
                    await mermaidInstance.parse(content)
                } catch (parseError) {
                    // If it's an "already registered" error, continue anyway
                    if (parseError instanceof Error && parseError.message.includes('already registered')) {
                        console.warn("Mermaid diagram type already registered, continuing with render");
                    } else {
                        throw new Error(`Invalid diagram syntax: ${parseError instanceof Error ? parseError.message : 'Unknown syntax error'}`)
                    }
                }

                // Use mermaid.render with proper error handling
                const {svg} = await mermaidInstance.render(id, content)
                
                if (isMounted && element) {
                    element.innerHTML = svg
                    setIsLoading(false)
                }
            } catch (error) {
                console.error("Mermaid error:", error)
                if (isMounted && containerRef.current) {
                    let errorMessage = "Failed to render diagram"
                    
                    if (error instanceof Error) {
                        // Handle specific Mermaid errors
                        if (error.message.includes("vertex.classes")) {
                            errorMessage = "Invalid diagram syntax: Missing or malformed node definitions"
                        } else if (error.message.includes("already registered")) {
                            errorMessage = "Diagram type conflict - please refresh the page"
                        } else {
                            errorMessage = error.message
                        }
                    }
                    
                    setError(errorMessage)
                    setIsLoading(false)
                }
            }
        }

        renderMermaid()

        // Cleanup function
        return () => {
            isMounted = false
            if (containerRef.current) {
                containerRef.current.innerHTML = ''
            }
        }
    }, [content, mermaidInstance, renderKey])

    const handleZoomIn = () => {
        setZoom((prev) => Math.min(prev + 0.2, 3))
    }

    const handleZoomOut = () => {
        setZoom((prev) => Math.max(prev - 0.2, 0.5))
    }

    const handleResetZoom = () => {
        setZoom(1)
    }

    const handleDownload = () => {
        if (!containerRef.current) return

        const svgElement = containerRef.current.querySelector("svg")
        if (!svgElement) return

        const svgContent = svgElement.outerHTML
        const blob = new Blob([svgContent], {type: "image/svg+xml"})
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `diagram-${Date.now()}.svg`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }

    if (!content) {
        return (
            <Alert className="border-muted">
                <AlertDescription className="text-muted-foreground">No diagram content provided</AlertDescription>
            </Alert>
        )
    }

    return (
        <TooltipProvider>
            <div className="flex flex-col gap-4 h-full">

                {/* Toolbar */}
                <div className="mermaid-toolbar flex items-center gap-2 rounded-lg border bg-card px-3 py-2 min-h-[2.75rem] flex-wrap md:flex-nowrap">
                <div className="flex items-center gap-1 flex-shrink-0 bg-muted/50 rounded-md p-1">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleZoomOut}
                                disabled={isLoading || zoom <= 0.5}
                                className="h-7 w-7 hover:bg-background"
                            >
                                <ZoomOut className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Zoom out (Ctrl + -)</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleResetZoom}
                                disabled={isLoading || zoom === 1}
                                className="h-7 w-7 hover:bg-background"
                            >
                                <Maximize2 className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Reset zoom (Ctrl + 0)</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleZoomIn}
                                disabled={isLoading || zoom >= 3}
                                className="h-7 w-7 hover:bg-background"
                            >
                                <ZoomIn className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Zoom in (Ctrl + +)</p>
                        </TooltipContent>
                    </Tooltip>
                    <Separator orientation="vertical" className="h-5 mx-0.5" />
                    <HoverCard>
                        <HoverCardTrigger asChild>
                            <span className="text-xs font-mono text-muted-foreground min-w-[2.5rem] text-center px-1 cursor-help">
                                {Math.round(zoom * 100)}%
                            </span>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-48">
                            <div className="text-sm">
                                <p className="font-medium">Zoom Level</p>
                                <p className="text-muted-foreground">Current zoom: {Math.round(zoom * 100)}%</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Use Ctrl + scroll or zoom buttons to adjust
                                </p>
                            </div>
                        </HoverCardContent>
                    </HoverCard>
                </div>

                <Separator orientation="vertical" className="h-6 hidden md:block" />

                {onViewChange && (
                    <>
                        <Select value={activeView || "preview"} onValueChange={onViewChange}>
                            <SelectTrigger className="h-8 w-auto min-w-[6rem] text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="preview">
                                    <div className="flex items-center gap-2">
                                        <Eye className="w-4 h-4" />
                                        <span>Preview</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="code">
                                    <div className="flex items-center gap-2">
                                        <Code className="w-4 h-4" />
                                        <span>Code</span>
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        <Separator orientation="vertical" className="h-6 hidden md:block" />
                    </>
                )}

                {onThemeChange && themeConfig && (
                    <div className="dropdown-container">
                        <DropdownMenu open={showThemeMenu} onOpenChange={setShowThemeMenu}>
                            <DropdownMenuTrigger asChild>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 gap-1.5 text-xs bg-transparent"
                                    >
                                        <Settings className="h-4 w-4" />
                                        <span className="hidden sm:inline">Theme</span>
                                        <ChevronDown className="h-3 w-3 opacity-50" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Theme and style settings</p>
                                </TooltipContent>
                            </Tooltip>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-56">
                            <DropdownMenuLabel className="text-xs font-semibold">Theme Settings</DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            {/* Theme Selection */}
                            <div className="px-2 py-2 space-y-3">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium">Theme</Label>
                                    <Select
                                        value={themeConfig.theme || "default"}
                                        onValueChange={(value) => onThemeChange({ theme: value as any })}
                                    >
                                        <SelectTrigger className="h-8 text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="default">Default</SelectItem>
                                            <SelectItem value="base">Base</SelectItem>
                                            <SelectItem value="dark">Dark</SelectItem>
                                            <SelectItem value="forest">Forest</SelectItem>
                                            <SelectItem value="neutral">Neutral</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Style Selection */}
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium">Style</Label>
                                    <Select
                                        value={themeConfig.look || "classic"}
                                        onValueChange={(value) => onThemeChange({ look: value as any })}
                                    >
                                        <SelectTrigger className="h-8 text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="classic">Classic</SelectItem>
                                            <SelectItem value="handDrawn">Hand Drawn</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Font Family */}
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium">Font Family</Label>
                                    <Select
                                        value={themeConfig.fontFamily || "Arial, sans-serif"}
                                        onValueChange={(value) => onThemeChange({ fontFamily: value })}
                                    >
                                        <SelectTrigger className="h-8 text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {/* Sans-serif fonts */}
                                            <SelectItem value="Arial, sans-serif">Arial</SelectItem>
                                            <SelectItem value="Verdana, Geneva, sans-serif">Verdana</SelectItem>
                                            <SelectItem value="Tahoma, Geneva, sans-serif">Tahoma</SelectItem>
                                            <SelectItem value="'Trebuchet MS', Helvetica, sans-serif">Trebuchet MS</SelectItem>
                                            <SelectItem value="'Segoe UI', Tahoma, Geneva, Verdana, sans-serif">Segoe UI</SelectItem>
                                            <SelectItem value="'Open Sans', Arial, sans-serif">Open Sans</SelectItem>

                                            {/* Serif fonts */}
                                            <SelectItem value="'Times New Roman', Times, serif">Times New Roman</SelectItem>
                                            <SelectItem value="Georgia, 'Times New Roman', serif">Georgia</SelectItem>

                                            {/* Monospace fonts */}
                                            <SelectItem value="'Courier New', Courier, monospace">Courier New</SelectItem>
                                            <SelectItem value="Monaco, 'Courier New', monospace">Monaco</SelectItem>
                                            <SelectItem value="'JetBrains Mono', 'Courier New', monospace">JetBrains Mono</SelectItem>
                                            <SelectItem value="'Fira Code', 'Courier New', monospace">Fira Code</SelectItem>

                                            {/* Display fonts */}
                                            <SelectItem value="Impact, Arial Black, sans-serif">Impact</SelectItem>
                                            <SelectItem value="'Arial Black', Arial, sans-serif">Arial Black</SelectItem>
                                            <SelectItem value="'Comic Sans MS', cursive">Comic Sans MS</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Font Size */}
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium">Font Size</Label>
                                    <Select
                                        value={String(themeConfig.fontSize || 16)}
                                        onValueChange={(value) => onThemeChange({ fontSize: Number.parseInt(value) })}
                                    >
                                        <SelectTrigger className="h-8 text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="10">10px</SelectItem>
                                            <SelectItem value="12">12px</SelectItem>
                                            <SelectItem value="14">14px</SelectItem>
                                            <SelectItem value="16">16px</SelectItem>
                                            <SelectItem value="18">18px</SelectItem>
                                            <SelectItem value="20">20px</SelectItem>
                                            <SelectItem value="22">22px</SelectItem>
                                            <SelectItem value="24">24px</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Dark Mode Toggle */}
                                <div className="flex items-center justify-between pt-1">
                                    <Label className="text-xs font-medium">Dark Mode</Label>
                                    <Switch
                                        checked={themeConfig.darkMode || false}
                                        onCheckedChange={(checked) => onThemeChange({ darkMode: checked })}
                                        aria-label="Toggle dark mode"
                                    />
                                </div>
                            </div>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}

                <div className="flex items-center gap-1.5 flex-shrink-0 ml-auto">
                    {/* AI Chat Button */}
                    {onToggleChat && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={showChat ? "default" : "outline"}
                                    size="sm"
                                    onClick={onToggleChat}
                                    className="h-8 gap-1.5 text-xs"
                                    aria-pressed={showChat}
                                >
                                    <SparklesIcon className="w-4 h-4" />
                                    <span className="hidden sm:inline">AI</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{showChat ? "Close AI chat" : "Open AI chat"}</p>
                            </TooltipContent>
                        </Tooltip>
                    )}

                    {/* Export Button */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleDownload}
                                disabled={isLoading || !!error}
                                className="h-8 w-8 flex-shrink-0 bg-transparent"
                            >
                                <Download className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Export as SVG</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>

            {/* Diagram Container */}
            <ScrollArea className="rounded-lg border bg-background h-full">
                {isLoading && (
                    <div className="flex flex-col gap-4 p-8">
                        <Loading className="h-4 w-4"/>
                    </div>
                )}

                {!isLoading && error && (
                    <Alert variant="destructive" className="m-4">
                        <AlertDescription className="font-mono text-sm text-wrap">{error}</AlertDescription>
                    </Alert>
                )}

                <div
                    ref={containerRef}
                    className="mermaid transition-transform duration-200 ease-out"
                    style={{
                        transform: `scale(${zoom})`,
                        transformOrigin: "center center",
                        fontSize: themeConfig?.fontSize ? `${themeConfig.fontSize}px` : undefined,
                        fontFamily: themeConfig?.fontFamily || undefined,
                    }}
                >
                    {content}
                </div>
            </ScrollArea>
        </div>
        </TooltipProvider>
    )
}

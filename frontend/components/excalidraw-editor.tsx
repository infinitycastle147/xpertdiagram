"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import "@excalidraw/excalidraw/index.css";
import { convertToExcalidrawElements}  from "@excalidraw/excalidraw"
import { parseMermaidToExcalidraw } from "@excalidraw/mermaid-to-excalidraw";
import { Loading } from "@/components/ui/loading";
import { getMermaidInstance } from "@/lib/mermaid-manager";

// Dynamically import Excalidraw for Next.js SSR
const Excalidraw = dynamic(
    async () => (await import("@excalidraw/excalidraw")).Excalidraw,
    { ssr: false }
);

interface ExcalidrawEditorProps {
    initialData?: string;
}



export function ExcalidrawEditor({
                                     initialData,
                                 }: ExcalidrawEditorProps) {
    const [parsedInitialData, setParsedInitialData] = useState<any>(null);

    // Parse Mermaid diagram and convert to Excalidraw elements
    useEffect(() => {
        const fetchData = async () => {
            if (initialData && initialData.trim().length > 0) {
                try {
                    // Ensure Mermaid is properly initialized using shared instance
                    const mermaidInstance = await getMermaidInstance();
                    if (!mermaidInstance) {
                        console.error("Failed to get shared Mermaid instance");
                        setParsedInitialData(null);
                        return;
                    }

                    const safeDiagram = initialData.replace(/\r\n/g, "\n").trim();
                    
                    // Validate Mermaid syntax before parsing
                    try {
                        await mermaidInstance.parse(safeDiagram);
                    } catch (parseError) {
                        // Handle specific parsing errors
                        if (parseError instanceof Error) {
                            if (parseError.message.includes("already registered")) {
                                console.warn("Mermaid diagram type already registered, continuing with conversion");
                                // Continue with the conversion despite the warning
                            } else if (parseError.message.includes("vertex.classes")) {
                                console.error("Mermaid parsing error: Invalid node class definitions");
                                setParsedInitialData(null);
                                return;
                            } else if (parseError.message.includes("gitGraph")) {
                                console.error("Mermaid parsing error: GitGraph diagram type conflict");
                                setParsedInitialData(null);
                                return;
                            } else {
                                console.error("Invalid Mermaid syntax for Excalidraw conversion:", parseError);
                                setParsedInitialData(null);
                                return;
                            }
                        } else {
                            console.error("Invalid Mermaid syntax for Excalidraw conversion:", parseError);
                            setParsedInitialData(null);
                            return;
                        }
                    }
                    
                    const { elements } = await parseMermaidToExcalidraw(safeDiagram);
                    const excalidrawElements = convertToExcalidrawElements(elements);

                    const sceneData = {
                        type: "excalidraw",
                        version: 2,
                        source: "mermaid",
                        elements: excalidrawElements,
                        appState: {},
                    };
                    setParsedInitialData(sceneData);
                } catch (error: any) {
                    console.error("Error parsing Mermaid to Excalidraw:", error);
                    
                    // Provide more specific error handling
                    if (error.message?.includes("vertex.classes")) {
                        console.error("Mermaid syntax error: Invalid node definitions");
                    } else if (error.message?.includes("already registered")) {
                        console.error("Mermaid conflict: Diagram type already registered");
                    }
                    
                    setParsedInitialData(null);
                }
            }
        };

        fetchData();
    }, [initialData]);


    if (initialData && parsedInitialData === null) {
        return <Loading />;
    }

    return (
        <div className="h-full w-full relative">            
            {/* Keep existing Excalidraw component (hidden behind overlay) */}
            <Excalidraw
                initialData={parsedInitialData}
            />
        </div>
    );
}

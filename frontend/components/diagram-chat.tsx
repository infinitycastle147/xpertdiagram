"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LoadingDots, LoadingSpinner } from "@/components/ui/loading"
import { X, Send, Bot, User, Loader2 } from "lucide-react"
import { createMessagesApi, createDiagramsApi } from "@/lib/supabase-utils"
import { useSupabase } from "@/app/supabase-provider"
import { useSession } from "@clerk/nextjs"
import { chatWithDiagram } from "@/lib/ai-service"
import type { DiagramType } from "@/lib/diagram-types"
import type { DiagramMessage, Diagram } from "@/lib/database-types"

interface DiagramChatProps {
    diagramId: string
    onClose: () => void
    onUpdateDiagram: (content: string) => void
}

export function DiagramChat({ diagramId, onClose, onUpdateDiagram }: DiagramChatProps) {
    const { supabase } = useSupabase()
    const { session } = useSession()
    const [messages, setMessages] = useState<DiagramMessage[]>([])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingMessages, setIsLoadingMessages] = useState(true)
    const [diagram, setDiagram] = useState<Diagram | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (supabase) {
            loadDiagram()
            loadMessages()
        }
    }, [diagramId, supabase])

    const loadDiagram = async () => {
        if (!supabase) return

        try {
            const diagramsApi = createDiagramsApi(supabase)
            const diagramData = await diagramsApi.getById(diagramId)
            setDiagram(diagramData)
        } catch (error) {
            console.error("Error loading diagram:", error)
        }
    }

    const loadMessages = async () => {
        if (!supabase) return

        try {
            setIsLoadingMessages(true)
            const messagesApi = createMessagesApi(supabase)
            const data = await messagesApi.getByDiagramId(diagramId)
            setMessages(data)

            // If no messages exist, add a welcome message
            if (data.length === 0) {
                const welcomeMessage = await messagesApi.create({
                    diagram_id: diagramId,
                    message_type: "assistant",
                    content:
                        "Hi! I'm here to help you improve your diagram. You can ask me to add features, modify the flow, or explain parts of the diagram.",
                })
                setMessages([welcomeMessage])
            }
        } catch (error) {
            console.error("Error loading messages:", error)
        } finally {
            setIsLoadingMessages(false)
        }
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSend = async (message?: string) => {
        const messageText = message || input.trim()
        if (!messageText || isLoading || !supabase || !diagram) return

        setInput("")
        setIsLoading(true)

        try {
            const messagesApi = createMessagesApi(supabase)
            const diagramsApi = createDiagramsApi(supabase)

            // Save user message to database
            const userMessage = await messagesApi.create({
                diagram_id: diagramId,
                message_type: "user",
                content: messageText,
            })

            setMessages((prev) => [...prev, userMessage])

            // Prepare chat history for API
            const chatHistory = messages.map((msg) => ({
                role: msg.message_type === "user" ? "user" : "assistant",
                content: msg.content,
            }))

            // Call the chat API
            const authToken = await session?.getToken()
            const chatResponse = await chatWithDiagram({
                type: diagram.type as DiagramType,
                diagram: diagram.content,
                query: messageText,
                chat_history: chatHistory,
            }, authToken || undefined)

            // Save assistant message to database
            const assistantMessage = await messagesApi.create({
                diagram_id: diagramId,
                message_type: "assistant",
                content: chatResponse.response,
            })

            setMessages((prev) => [...prev, assistantMessage])

            // Update diagram if it changed
            if (chatResponse.updated_diagram !== diagram.content && chatResponse.updated_diagram !== null) {
                await diagramsApi.update(diagramId, {
                    content: chatResponse.updated_diagram,
                })

                // Update local diagram state
                setDiagram((prev) => (prev ? { ...prev, content: chatResponse.updated_diagram } : null))

                // Update the diagram in the parent component
                onUpdateDiagram(chatResponse.updated_diagram)
            }
        } catch (error) {
            console.error("Chat error:", error)
            try {
                const messagesApi = createMessagesApi(supabase)
                const errorMessage = await messagesApi.create({
                    diagram_id: diagramId,
                    message_type: "assistant",
                    content: "Sorry, I encountered an error. Please try again.",
                })
                setMessages((prev) => [...prev, errorMessage])
            } catch (saveError) {
                console.error("Error saving error message:", saveError)
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div className="h-full flex flex-col bg-card">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0 bg-card/50">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0">
                        <h3 className="font-semibold text-sm text-foreground">AI Assistant</h3>
                        <p className="text-xs text-muted-foreground">Ready to help improve your diagram</p>
                    </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onClose} 
                  className="rounded-lg hover-scale flex-shrink-0 hover:bg-muted"
                  title="Close chat"
                >
                    <X className="w-4 h-4" />
                </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-thin min-h-0">
                <div className="space-y-4">
                    {isLoadingMessages ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="w-12 h-12 rounded-xl bg-muted/30 flex items-center justify-center mb-3">
                                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                            </div>
                            <span className="text-sm text-muted-foreground">Loading conversation...</span>
                        </div>
                    ) : (
                        messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.message_type === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`flex gap-2 max-w-[90%] ${
                                        message.message_type === "user" ? "flex-row-reverse" : "flex-row"
                                    }`}
                                >
                                    <Avatar className="w-7 h-7 flex-shrink-0">
                                        <AvatarFallback
                                            className={
                                                message.message_type === "user"
                                                    ? "bg-primary/10 text-primary border border-primary/20"
                                                    : "bg-accent/10 text-accent-foreground border border-accent/20"
                                            }
                                        >
                                            {message.message_type === "user" ? (
                                                <User className="w-3.5 h-3.5" />
                                            ) : (
                                                <Bot className="w-3.5 h-3.5" />
                                            )}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex flex-col gap-1 min-w-0">
                                        <Card
                                            className={`${
                                                message.message_type === "user"
                                                    ? "bg-primary text-white border-primary"
                                                    : "bg-muted/50 border-border"
                                            }`}
                                        >
                                            <CardContent className="px-3 py-2">
                                                <p className="text-xs leading-relaxed whitespace-pre-wrap break-words">
                                                    {message.content}
                                                </p>
                                            </CardContent>
                                        </Card>

                                        <p
                                            className={`text-[10px] text-muted-foreground px-1 ${
                                                message.message_type === "user" ? "text-right" : "text-left"
                                            }`}
                                        >
                                            {new Date(message.created_at).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="flex gap-2 max-w-[90%]">
                                <Avatar className="w-7 h-7 flex-shrink-0">
                                    <AvatarFallback className="bg-accent/10 text-accent-foreground border border-accent/20">
                                        <Bot className="w-3.5 h-3.5" />
                                    </AvatarFallback>
                                </Avatar>
                                <Card className="bg-muted/50 border-border">
                                    <CardContent className="px-3 py-2">
                                        <LoadingDots text="Thinking..." size="sm" />
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input */}
            <div className="border-t border-border px-4 py-3 flex-shrink-0 bg-card/30">
                <div className="flex gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask me to modify your diagram..."
                        disabled={isLoading}
                        className="flex-1 rounded-lg h-9 text-sm bg-background/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                        maxLength={500}
                    />
                    <Button
                        onClick={() => handleSend()}
                        disabled={!input.trim() || isLoading}
                        size="sm"
                        className="rounded-lg text-white bg-primary hover:bg-primary/90 transition-colors"
                        title="Send message"
                    >
                        {isLoading ? <LoadingSpinner size="sm" /> : <Send className="w-4 h-4" />}
                    </Button>
                </div>
                {input.length > 400 && (
                  <p className="text-xs text-muted-foreground mt-1 text-right">
                    {input.length}/500
                  </p>
                )}
            </div>
        </div>
    )
}

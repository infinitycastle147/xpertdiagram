"use client";

import type React from "react";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { LoadingSpinner } from "@/components/ui/loading";
import { Button } from "@/components/ui/button";
import { Copy, RotateCcw, Maximize2, Minimize2, Save, Loader2, Eye, Code } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface CodeEditorProps {
  content: string;
  onChange: (content: string) => void;
  onSave?: () => void;
  isSaving?: boolean;
  // View switching
  activeView?: string;
  onViewChange?: (view: string) => void;
}

export function CodeEditor({
  content,
  onChange,
  onSave,
  isSaving,
  activeView,
  onViewChange,
}: CodeEditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-full flex flex-col bg-background">
        <div className="flex items-center justify-between p-4 border-b bg-card border-border">
          <span className="text-sm font-medium text-foreground">Mermaid Code Editor</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-xs text-muted-foreground">Loading editor...</span>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center bg-muted/20">
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center mx-auto mb-3">
              <LoadingSpinner size="lg" />
            </div>
            <p className="text-sm text-muted-foreground">Initializing code editor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <EnhancedEditor 
      content={content} 
      onChange={onChange} 
      onSave={onSave}
      isSaving={isSaving}
      activeView={activeView}
      onViewChange={onViewChange}
    />
  );
}

// Enhanced editor with syntax highlighting, line numbers, and advanced features
function EnhancedEditor({ content, onChange, onSave, isSaving, activeView, onViewChange }: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [history, setHistory] = useState<string[]>([content]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeLineNumber, setActiveLineNumber] = useState<number | null>(null);

  // Memoize line count for performance
  const lines = useMemo(() => content.split("\n"), [content]);
  const lineCount = lines.length;

  // Add to history for undo/redo
  const addToHistory = useCallback(
    (newContent: string) => {
      setHistory((prev) => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(newContent);
        // Limit history to 50 entries
        if (newHistory.length > 50) {
          newHistory.shift();
          return newHistory;
        }
        return newHistory;
      });
      setHistoryIndex((prev) => Math.min(prev + 1, 49));
    },
    [historyIndex]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newContent = e.target.value;
      onChange(newContent);
      addToHistory(newContent);
    },
    [onChange, addToHistory]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const value = target.value;

      // Tab handling - insert 2 spaces
      if (e.key === "Tab") {
        e.preventDefault();
        const newValue =
          value.substring(0, start) + "  " + value.substring(end);
        onChange(newValue);
        addToHistory(newValue);
        setTimeout(() => {
          target.selectionStart = target.selectionEnd = start + 2;
        }, 0);
      }

      // Undo (Ctrl/Cmd + Z)
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          onChange(history[newIndex]);
        }
      }

      // Redo (Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y)
      if (
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "z") ||
        ((e.ctrlKey || e.metaKey) && e.key === "y")
      ) {
        e.preventDefault();
        if (historyIndex < history.length - 1) {
          const newIndex = historyIndex + 1;
          setHistoryIndex(newIndex);
          onChange(history[newIndex]);
        }
      }

      // Auto-indent on Enter
      if (e.key === "Enter") {
        e.preventDefault();
        const currentLine = value.substring(0, start).split("\n").pop() || "";
        const indent = currentLine.match(/^\s*/)?.[0] || "";
        const newValue =
          value.substring(0, start) + "\n" + indent + value.substring(end);
        onChange(newValue);
        addToHistory(newValue);
        setTimeout(() => {
          target.selectionStart = target.selectionEnd =
            start + 1 + indent.length;
        }, 0);
      }

      // Bracket/Quote auto-completion
      const pairs: Record<string, string> = {
        "(": ")",
        "[": "]",
        "{": "}",
        '"': '"',
        "'": "'",
      };

      if (pairs[e.key] && start === end) {
        e.preventDefault();
        const newValue =
          value.substring(0, start) +
          e.key +
          pairs[e.key] +
          value.substring(end);
        onChange(newValue);
        addToHistory(newValue);
        setTimeout(() => {
          target.selectionStart = target.selectionEnd = start + 1;
        }, 0);
      }
    },
    [onChange, addToHistory, history, historyIndex]
  );

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [content]);

  const handleReset = useCallback(() => {
    if (confirm("Are you sure you want to clear the editor?")) {
      onChange("");
      addToHistory("");
    }
  }, [onChange, addToHistory]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLTextAreaElement>) => {
    const lineNumbersEl = document.getElementById("line-numbers");
    if (lineNumbersEl) {
      lineNumbersEl.scrollTop = e.currentTarget.scrollTop;
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLTextAreaElement>) => {
      if (!textareaRef.current) return;
      const textarea = textareaRef.current;
      const rect = textarea.getBoundingClientRect();
      const y = e.clientY - rect.top + textarea.scrollTop;
      const lineHeight = Number.parseInt(getComputedStyle(textarea).lineHeight);
      const lineNumber = Math.floor(y / lineHeight) + 1;
      setActiveLineNumber(lineNumber);
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    setActiveLineNumber(null);
  }, []);

  return (
    <div
      className={`flex flex-col bg-background ${
        isFullscreen ? "fixed inset-0 z-50" : "h-full"
      }`}
    >
      {/* Header with toolbar */}
      <div className="flex items-center justify-between p-3 border-b bg-card border-border">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-foreground">
            Mermaid Code Editor
          </span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span className="text-xs text-muted-foreground">
              {lineCount} {lineCount === 1 ? "line" : "lines"}
            </span>
          </div>

          {/* View Selector */}
          {onViewChange && (
            <>
              <Separator orientation="vertical" className="h-5" />
              <div className="flex items-center gap-2">
                <Select
                  value={activeView || "code"}
                  onValueChange={onViewChange}
                >
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="preview">
                      <div className="flex items-center gap-2">
                        <Eye className="w-3 h-3" />
                        <span>Preview</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="code">
                      <div className="flex items-center gap-2">
                        <Code className="w-3 h-3" />
                        <span>Code</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Save Button */}
          {onSave && (
            <Button
              size="sm"
              onClick={onSave}
              disabled={isSaving}
              className="h-8 px-3 bg-chart-2 hover:bg-chart-2/80 text-white"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
              ) : (
                <Save className="w-4 h-4 mr-1.5" />
              )}
              Save
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            disabled={!content}
            className="h-8 px-3"
          >
            <Copy className="h-4 w-4 mr-1.5" />
            {copied ? "Copied!" : "Copy"}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            disabled={!content}
            className="h-8 px-3"
          >
            <RotateCcw className="h-4 w-4 mr-1.5" />
            Clear
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="h-8 px-3"
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Editor area with line numbers */}
      <div className="flex-1 flex overflow-hidden">
        {/* Line numbers */}
        <div
          id="line-numbers"
          className="flex-shrink-0 w-12 bg-muted/30 border-r border-border overflow-hidden select-none"
          style={{ overflowY: "hidden" }}
        >
          <div className="py-4 px-2 font-mono text-xs text-muted-foreground text-right leading-relaxed">
            {Array.from({ length: lineCount }, (_, i) => (
              <div
                key={i}
                className={`min-h-[1.6em] ${
                  activeLineNumber === i + 1
                    ? "text-foreground font-semibold"
                    : ""
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Editor container */}
        <div className="flex-1 relative overflow-hidden">
          {/* Actual textarea */}
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onScroll={handleScroll}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            spellCheck={false}
            className="absolute inset-0 w-full h-full resize-none p-4 font-mono text-sm bg-transparent placeholder:text-muted-foreground focus:outline-none leading-relaxed"
            placeholder="Enter your Mermaid diagram code here...&#10;&#10;Example:&#10;graph TD&#10;  A[Start]  B[Process]&#10;  B  C[End]"
            style={{
              fontFamily:
                '"Fira Code", "JetBrains Mono", Consolas, "Courier New", monospace',
              fontSize: "14px",
              tabSize: 2,
              color: "#000000",
              caretColor: "#000000",
            }}
            aria-label="Mermaid code editor"
          />
        </div>
      </div>

      {/* Footer with keyboard shortcuts hint */}
      <div className="flex items-center justify-between px-4 py-2 border-t bg-muted/30 border-border text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>Tab: Indent</span>
          <span>Ctrl+Z: Undo</span>
          <span>Ctrl+Y: Redo</span>
        </div>
        <span className="text-emerald-600 font-medium">Ready to edit</span>
      </div>
    </div>
  );
}

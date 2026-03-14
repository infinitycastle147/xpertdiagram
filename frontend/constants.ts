// Backend configuration
export const BACKEND_CONFIG = {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL,
    HEALTH_CHECK_INTERVAL: 5 * 60 * 1000, // 5 minutes
    MAX_RETRIES: 5,
    TIMEOUT: 30000, // 30 seconds
} as const;

// Mermaid configuration extracted as a constant
export const MERMAID_CONFIG = {
    startOnLoad: false,
    theme: 'base',
    securityLevel: 'loose',
    fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
    themeVariables: {
        primaryColor: '#4ECDC4',
        primaryTextColor: '#000000',
        primaryBorderColor: '#4ECDC4',
        lineColor: '#6B7280',
        sectionBkgColor: '#F8F9FA',
        altSectionBkgColor: '#FFFFFF',
        gridColor: '#E5E7EB',
        secondaryColor: '#FFE66D',
        tertiaryColor: '#A8E6CF'
    },
    flowchart: { useMaxWidth: true, htmlLabels: true, curve: 'basis', padding: 20 },
    sequence: { useMaxWidth: true, wrap: true, diagramMarginX: 50, diagramMarginY: 10, messageMargin: 35, mirrorActors: true, bottomMarginAdj: 1 },
    gantt: { useMaxWidth: true, titleTopMargin: 25, barHeight: 20, barGap: 4, topPadding: 50, leftPadding: 75, gridLineStartPadding: 35, fontSize: 11, numberSectionStyles: 4 },
    class: { useMaxWidth: true, defaultRenderer: 'dagre-d3' },
    state: { useMaxWidth: true, dividerMargin: 10, sizeUnit: 5, padding: 8, textHeight: 10, titleShift: -15, noteMargin: 10, forkWidth: 70, forkHeight: 7, miniPadding: 2, defaultRenderer: 'dagre-d3' },
    er: { useMaxWidth: true, entityPadding: 15, minEntityWidth: 100, minEntityHeight: 75, fontSize: 12, layoutDirection: 'TB' },
    journey: { useMaxWidth: true, diagramMarginX: 50, diagramMarginY: 10, leftMargin: 150, width: 150, height: 50, boxMargin: 10, boxTextMargin: 5 },
    pie: { useMaxWidth: true, textPosition: 0.75 },
    quadrantChart: { useMaxWidth: true, chartWidth: 500, chartHeight: 500 },
    requirement: { useMaxWidth: true, rect_fill: '#f9f9f9', rect_border_size: '0.5px', rect_min_width: 200, rect_min_height: 200, fontSize: 14 },
    gitGraph: { useMaxWidth: true, titleTopMargin: 25, diagramPadding: 8, nodeLabel: { width: 75, height: 100, x: -25, y: 0 }, mainBranchName: 'main', mainBranchOrder: 0, showCommitLabel: true, showBranches: true, rotateCommitLabel: true },
    c4: { useMaxWidth: true, diagramMarginX: 50, diagramMarginY: 10, c4ShapeMargin: 50, c4ShapePadding: 20, width: 216, height: 60, boxMargin: 10, c4BoundaryInRow: 4, personFontSize: 14, personFontFamily: 'Open Sans', personFontWeight: 'normal', external_personFontSize: 14, external_personFontFamily: 'Open Sans', external_personFontWeight: 'normal' },
    mindmap: { useMaxWidth: true, padding: 10, maxNodeWidth: 200 },
    timeline: { useMaxWidth: true, diagramMarginX: 50, diagramMarginY: 10, leftMargin: 150, width: 150, height: 50, boxMargin: 10, boxTextMargin: 5, noteMargin: 10, messageMargin: 35, messageAlign: 'center' },
    sankey: { useMaxWidth: true, width: 600, height: 400, linkColor: 'gradient', nodeAlignment: 'justify' },
    xyChart: { useMaxWidth: true, width: 700, height: 500, titlePadding: 10, titleFontSize: 20, showTitle: true, xAxis: { showLabel: true, labelFontSize: 14, labelPadding: 5, showTitle: true, titleFontSize: 16, titlePadding: 5, showTick: true, tickLength: 5, tickWidth: 2, showAxisLine: true, axisLineWidth: 2 }, yAxis: { showLabel: true, labelFontSize: 14, labelPadding: 5, showTitle: true, titleFontSize: 16, titlePadding: 5, showTick: true, tickLength: 5, tickWidth: 2, showAxisLine: true, axisLineWidth: 2 }, chartOrientation: 'vertical' },
    block: { useMaxWidth: true, padding: 8 },
    packet: { useMaxWidth: true, rowHeight: 32, bitWidth: 32, bitsPerRow: 32, showBits: true, paddingX: 5, paddingY: 5 },
    architecture: { useMaxWidth: true, padding: 8, iconSize: 60, fontSize: 14 },
    kanban: { useMaxWidth: true, padding: 8, sectionWidth: 200 }
} as const;
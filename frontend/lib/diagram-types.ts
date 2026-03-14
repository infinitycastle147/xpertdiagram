export enum DiagramType {
  FLOWCHART = "flowchart",
  SEQUENCE = "sequence",
  CLASS = "class",
  STATE = "state",
  ERD = "erd",
  USER_JOURNEY = "user_journey",
  GANTT = "gantt",
  PIE = "pie",
  QUADRANT_CHART = "quadrant_chart",
  REQUIREMENT = "requirement",
  GITGRAPH = "gitgraph",
  C4 = "c4",
  MINDMAP = "mindmap",
  TIMELINE = "timeline",
  ZENUML = "zenuml",
  SANKEY = "sankey",
  XY_CHART = "xy_chart",
  BLOCK = "block",
  PACKET = "packet",
  KANBAN = "kanban",
  ARCHITECTURE = "architecture",
  RADAR = "radar"
}

export const DiagramTypeLabels: Record<DiagramType, string> = {
  [DiagramType.FLOWCHART]: "Flowchart",
  [DiagramType.SEQUENCE]: "Sequence Diagram",
  [DiagramType.CLASS]: "Class Diagram",
  [DiagramType.STATE]: "State Diagram",
  [DiagramType.ERD]: "Entity Relationship",
  [DiagramType.USER_JOURNEY]: "User Journey",
  [DiagramType.GANTT]: "Gantt Chart",
  [DiagramType.PIE]: "Pie Chart",
  [DiagramType.QUADRANT_CHART]: "Quadrant Chart",
  [DiagramType.REQUIREMENT]: "Requirement Diagram",
  [DiagramType.GITGRAPH]: "Git Graph",
  [DiagramType.C4]: "C4 Diagram",
  [DiagramType.MINDMAP]: "Mind Map",
  [DiagramType.TIMELINE]: "Timeline",
  [DiagramType.ZENUML]: "ZenUML",
  [DiagramType.SANKEY]: "Sankey Diagram",
  [DiagramType.XY_CHART]: "XY Chart",
  [DiagramType.BLOCK]: "Block Diagram",
  [DiagramType.PACKET]: "Packet Diagram",
  [DiagramType.KANBAN]: "Kanban Board",
  [DiagramType.ARCHITECTURE]: "Architecture Diagram",
  [DiagramType.RADAR]: "Radar Chart"
};

export interface DetectTypeRequest {
  query: string;
  content: string;
}

export interface DetectTypeResponse {
  diagram_type: DiagramType;
}

export interface DiagramRequest {
  type: DiagramType;
  query: string;
  content: string;
}

export interface DiagramResponse {
  diagram: string;
}